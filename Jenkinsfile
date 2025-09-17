pipeline {
    agent any

    environment {
        IMAGE_NAME = 'tira-be'
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

                // Cài pnpm nếu chưa có
                sh '''
                if ! command -v pnpm > /dev/null; then
                    echo "Installing pnpm..."
                    npm install -g pnpm
                else
                    echo "pnpm already installed"
                fi
                '''

                // Build dự án
                sh 'pnpm install'
                sh 'pnpm prisma generate'
                sh 'pnpm build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_PASS'
                )]) {
                    sh """
                    echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin
                    docker build -t \$DOCKERHUB_USER/${IMAGE_NAME}:latest .
                    docker push \$DOCKERHUB_USER/${IMAGE_NAME}:latest
                    """
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
                        sh """
                        ssh \$VPS 'bash -s' < ./deploy.sh
                        """
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
                sh """
                curl -s -X POST https://api.telegram.org/bot\$TELEGRAM_TOKEN/sendMessage \
                -d chat_id=\$TELEGRAM_CHAT_ID \
                -d text='✅ CI/CD SUCCESS: Build, Push DockerHub & Deploy to VPS DONE'
                """
            }
        }

        failure {
            withCredentials([
                string(credentialsId: 'telegram-token', variable: 'TELEGRAM_TOKEN'),
                string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
            ]) {
                sh """
                curl -s -X POST https://api.telegram.org/bot\$TELEGRAM_TOKEN/sendMessage \
                -d chat_id=\$TELEGRAM_CHAT_ID \
                -d text='❌ CI/CD FAILED'
                """
            }
        }
    }
}
