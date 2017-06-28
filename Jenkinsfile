pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh './gradlew build'
                docker build -t case/caseincportal .
            }
        }
        stage('deploy') {
            steps {
             timeout(time: 3, unit: 'MINUTES') {
                docker push 
              }
            }
        }
    }
}
