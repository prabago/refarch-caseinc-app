pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh './gradlew build'
            }
        }
        stage('deploy') {
            steps {
             timeout(time: 3, unit: 'MINUTES') {
                sh './deployToWlp.sh'
              }
            }
        }
    }
}
