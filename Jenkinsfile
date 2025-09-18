pipeline {
    agent {
        docker {
            image 'my-node-docker:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock -u root:root'
        }
    }

    environment {
        IMAGE_NAME = 'tira-be'
        PATH = "/usr/bin:/usr/local/bin:$PATH"
    }

    stages {
        stage('Checkout & Build NestJS') {
            steps {
                git branch: 'main', url: 'https://github.com/Fink2005/time-keeping-be.git', credentialsId: 'github-pat'
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
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
                        sh "ssh $VPS 'bash -s' < ./deploy.sh"
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
                sh "curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage -d chat_id=$TELEGRAM_CHAT_ID -d text='✅ CI/CD SUCCESS'"
            }
        }
        failure {
            withCredentials([
                string(credentialsId: 'telegram-token', variable: 'TELEGRAM_TOKEN'),
                string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
            ]) {
                sh "curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage -d chat_id=$TELEGRAM_CHAT_ID -d text='❌ CI/CD FAILED'"
            }
        }
    }
}
