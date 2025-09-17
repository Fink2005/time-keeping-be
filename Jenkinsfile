pipeline {
    agent any

    environment {
        IMAGE_NAME = 'tira-be'
        PATH = "/usr/bin:/usr/local/bin:$PATH" // đảm bảo Node/NPM nhận diện
    }

    stages {
        stage('Checkout & Build NestJS') {
            steps {
                // Checkout repo với GitHub PAT
                git(
                    branch: 'main',
                    url: 'https://github.com/Fink2005/time-keeping-be.git',
                    credentialsId: 'github-pat'
                )

                // Build dự án với pnpm local (npx)
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh '''
                    # Kiểm tra Node
                    if ! command -v node > /dev/null; then
                        echo "Node.js not found! Please install Node.js on agent."
                        exit 1
                    fi

                    # Kiểm tra npm
                    if ! command -v npm > /dev/null; then
                        echo "npm not found! Please install npm on agent."
                        exit 1
                    fi

                    # Cài pnpm local nếu chưa có trong node_modules
                    if [ ! -d node_modules/.pnpm ]; then
                        npm install pnpm --save-dev
                    fi

                    # Dùng npx để chạy pnpm
                    npx pnpm install
                    npx pnpm prisma generate
                    npx pnpm build
                    '''
                }
            }
        }

        stage('Docker Build & Push') {
            when {
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_PASS'
                )]) {
                    sh '''
                    echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
                    docker build -t $DOCKERHUB_USER/${IMAGE_NAME}:latest .
                    docker push $DOCKERHUB_USER/${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy to VPS') {
            steps {
                sshagent(['vps-ssh-credential-id']) {
                    withCredentials([
                        string(credentialsId: 'vps-credential', variable: 'VPS'),
                        string(credentialsId: 'telegram-token', variable: 'TELEGRAM_TOKEN'),
                        string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
                    ]) {
                        sh '''
                        ssh $VPS 'bash -s' < ./deploy.sh
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            withCredentials([
                string(credentialsId: 'telegram-token', variable: 'TELEGRAM_TOKEN'),
                string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
            ]) {
                sh '''
                curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage \
                -d chat_id=$TELEGRAM_CHAT_ID \
                -d text='✅ CI/CD SUCCESS: Build, Push DockerHub & Deploy to VPS DONE'
                '''
            }
        }

        failure {
            withCredentials([
                string(credentialsId: 'telegram-token', variable: 'TELEGRAM_TOKEN'),
                string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
            ]) {
                sh '''
                curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage \
                -d chat_id=$TELEGRAM_CHAT_ID \
                -d text='❌ CI/CD FAILED'
                '''
            }
        }
    }
}
