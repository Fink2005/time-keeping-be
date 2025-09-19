pipeline {
    agent any

    environment {
        IMAGE_NAME = 'tira-be'
        PATH       = "/usr/bin:/usr/local/bin:$PATH"
        VPS        = 'checkingapp@20.17.97.172' // hoặc credential text nếu muốn bảo mật
    }

    stages {
        stage('Checkout & Build NestJS') {
            steps {
                deleteDir()
                // Dùng git username/password credential
                withCredentials([usernamePassword(credentialsId: 'git-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    git(
                        branch: 'main',
                        url: "https://${GIT_USER}:${GIT_PASS}@github.com/Fink2005/time-keeping-be.git"
                    )
                }

                sh '''
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
                sh "curl -s -X POST https://api.telegram.org/bot${TG_TOKEN}/sendMessage -d chat_id=${TG_CHAT} -d text='✅ CI/CD SUCCESS'"
            }
        }
        failure {
            withCredentials([string(credentialsId: 'telegram-token', variable: 'TG_TOKEN'),
                             string(credentialsId: 'telegram-chat-id', variable: 'TG_CHAT')]) {
                sh "curl -s -X POST https://api.telegram.org/bot${TG_TOKEN}/sendMessage -d chat_id=${TG_CHAT} -d text='❌ CI/CD FAILED'"
            }
        }
        always {
            sh 'docker image prune -f --filter "dangling=true"'
        }
    }
}
