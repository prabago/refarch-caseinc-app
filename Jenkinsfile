pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh './gradlew build'
                docker build -t case/webportal .
            }
        }
        stage('deploy') {
            steps {
             timeout(time: 3, unit: 'MINUTES') {
                sh './publishToICPpwd
                .sh' 
              }
            }
        }
    }
}
