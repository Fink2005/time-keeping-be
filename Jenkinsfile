pipeline {
    agent {
        docker {
            image 'my-node-docker:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:/workspace -u root:root'
        }
    }
    environment {
        IMAGE_NAME = 'tira-be'
        PATH = "/usr/bin:/usr/local/bin:$PATH"
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs() // Xóa workspace trước khi clone
            }
        }
        stage('Checkout & Build NestJS') {
            steps {
                dir('/workspace') { // Làm việc trong thư mục /workspace
                    git branch: 'main', url: 'https://github.com/Fink2005/time-keeping-be.git', credentialsId: 'github-pat'
                    sh '''
                        pwd
                        ls -la
                        git status || echo "Not a git directory"
                        npm ci
                        npx prisma generate
                        npm run build
                    '''
                }
            }
        }
        stage('Docker Build & Push') {
            when { expression { currentBuild.currentResult == 'SUCCESS' } }
            steps {
                dir('/workspace') { // Đảm bảo build trong /workspace
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh '''
                            echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
                            docker build -t $DOCKERHUB_USER/${IMAGE_NAME}:latest .
                            docker push $DOCKERHUB_USER/${IMAGE_NAME}:latest
                        '''
                    }
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
                        sh "ssh $VPS 'bash -s' < ./deploy
