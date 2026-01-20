pipeline {
    agent any
    
    environment {
        DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/nutriapp'
        BASE_URL = 'http://localhost:3000'
        CI = 'true'
        NODE_VERSION = '20'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup PostgreSQL') {
            steps {
                script {
                    // Asegúrate de que PostgreSQL esté corriendo
                    // En Jenkins, puedes usar Docker o tener PostgreSQL instalado
                    sh '''
                        # Verificar si PostgreSQL está corriendo
                        if ! pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; then
                            echo "PostgreSQL no está disponible. Asegúrate de tenerlo configurado."
                            exit 1
                        fi
                        
                        # Crear base de datos si no existe
                        PGPASSWORD=postgres psql -h localhost -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'nutriapp'" | grep -q 1 || \
                        PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE nutriapp;"
                    '''
                }
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Usar Node.js 20
                    sh '''
                        # Verificar si nvm está disponible, si no, usar node directamente
                        if command -v nvm &> /dev/null; then
                            source ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION} || nvm install ${NODE_VERSION}
                        fi
                        
                        node --version
                        npm --version
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Setup Database') {
            steps {
                sh '''
                    npx prisma generate
                    npx prisma migrate deploy
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    // Publicar reportes HTML de Playwright
                    publishHTML([
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report',
                        keepAll: true
                    ])
                }
            }
        }
    }
    
    post {
        always {
            // Limpiar reportes antiguos
            cleanWs()
        }
        failure {
            echo 'Pipeline falló. Revisa los logs para más detalles.'
        }
        success {
            echo 'Pipeline completado exitosamente.'
        }
    }
}
