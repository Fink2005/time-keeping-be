pipeline {
    agent any

    environment {
        IMAGE_NAME = 'tira-be'
        PATH = "/usr/local/bin:$PATH" // đảm bảo Node/NPM/pnpm nằm trong PATH
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

                // Check Node/NPM/pnpm
                sh '''
                if ! command -v node > /dev/null; then
                    echo "Node.js not found! Please install Node.js on agent."
                    exit 1
                fi

                if ! command -v npm > /dev/null; then
                    echo "npm not found! Please install npm on agent."
                    exit 1
                fi

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
                    script {
                        // Check credential tồn tại trước khi deploy
                        if (!Jenkins.instance.getCredentials().find { it.id == 'telegram-token' }) {
                            error "Credential 'telegram-token' not found in Jenkins!"
                        }
                        if (!Jenkins.instance.getCredentials().find { it.id == 'telegram-chat-id' }) {
                            error "Credential 'telegram-chat-id' not found in Jenkins!"
                        }

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
