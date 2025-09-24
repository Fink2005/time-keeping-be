pipeline {
    agent any
    environment {
        IMAGE_NAME = 'tira-be'
        PATH       = "/usr/bin:/usr/local/bin:$PATH"
        VPS        = 'checkingapp@20.17.97.172'
    }
    stages {
        stage('Checkout & Build NestJS') {
            steps {
                // Checkout code với credential
                withCredentials([usernamePassword(credentialsId: 'git-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    git(
                        branch: 'main',
                        url: "https://${GIT_USER}:${GIT_PASS}@github.com/Fink2005/time-keeping-be.git"
                    )
                }
                // Lấy thông tin commit gần nhất
                script {
                    env.GIT_COMMITTER = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                    env.GIT_COMMIT_MSG = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
                }
                // Chỉ xóa folder build & generated, giữ cache npm & Prisma
                sh '''
                    set -e
                    rm -rf dist prisma/generated
                    npm ci
                    npx prisma generate
                    npm run build
                '''
            }
        }
        stage('Docker Build & Push') {
            when { expression { currentBuild.currentResult == 'SUCCESS' } }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        set -e
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t $DOCKER_USER/${IMAGE_NAME}:latest .
                        docker push $DOCKER_USER/${IMAGE_NAME}:latest
                    '''
                }
            }
        }
        stage('Deploy to VPS') {
            steps {
                sshagent(credentials: ['vps-key']) {
                    sh '''
                        set -e
                        ssh -o StrictHostKeyChecking=no $VPS "bash /home/checkingapp/deploy.sh"
                    '''
                }
            }
        }
    }
    post {
        success {
            withCredentials([string(credentialsId: 'telegram-token', variable: 'TG_TOKEN'),
                             string(credentialsId: 'telegram-chat-id', variable: 'TG_CHAT')]) {
                sh '''
                    BUILD_TIME=$(date "+%Y-%m-%d %H:%M:%S")
                    curl -s -X POST https://api.telegram.org/bot${TG_TOKEN}/sendMessage \
                        -d chat_id=${TG_CHAT} \
                        -d parse_mode=HTML \
                        -d text="✅ <b>CI/CD SUCCESS</b>
━━━━━━━━━━━━
👤 <b>Committer:</b> $GIT_COMMITTER
📝 <b>Message:</b> $GIT_COMMIT_MSG
🌿 <b>Branch:</b> main
⏰ <b>Time:</b> $BUILD_TIME
━━━━━━━━━━━━"
                '''
            }
        }
        failure {
            withCredentials([string(credentialsId: 'telegram-token', variable: 'TG_TOKEN'),
                             string(credentialsId: 'telegram-chat-id', variable: 'TG_CHAT')]) {
                sh '''
                    BUILD_TIME=$(date "+%Y-%m-%d %H:%M:%S")
                    LOGS=$(tail -n 50 $WORKSPACE/../logs/*log 2>/dev/null | sed 's/&/&amp;/g; s/</\\&lt;/g; s/>/\\&gt;/g')
                    if [ -z "$LOGS" ]; then LOGS="No logs available"; fi

                    curl -s -X POST https://api.telegram.org/bot${TG_TOKEN}/sendMessage \
                        -d chat_id=${TG_CHAT} \
                        -d parse_mode=HTML \
                        -d text="❌ <b>CI/CD FAILED</b>
━━━━━━━━━━━━
👤 <b>Committer:</b> $GIT_COMMITTER
📝 <b>Message:</b> $GIT_COMMIT_MSG
🌿 <b>Branch:</b> main
⏰ <b>Time:</b> $BUILD_TIME
📄 <b>Last Logs:</b>
<pre>$LOGS</pre>
━━━━━━━━━━━━"
                '''
            }
        }
        always {
            // Dọn Docker dangling images
            sh 'docker image prune -f --filter "dangling=true"'
        }
    }
}
