pipeline {
  agent any
  stages {
    stage ('Start') {
      steps {
        slackSend (
          color: '#FFFF00',
          message: "STARTED: Job '${env.JOB_NAME} " +
            "[${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        )
      }
    }
    stage('Build') {
      steps {
        sh '''
          npm install
          ng build --aot -e deploy --bh '/gpf/' -d '/gpf/'
          cd dist/
          tar zcvf ../gpfjs-dist.tar.gz .
          cd -
        '''
      }
    }
  }
  post {
    success {
      slackSend (
        color: '#00FF00',
        message: "SUCCESSFUL: Job '${env.JOB_NAME} " +
                 "[${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
      )
      archive 'gpfjs-dist.tar.gz'
      fingerprint 'gpfjs-dist.tar.gz'
    }
    failure {
      slackSend (
        color: '#FF0000',
        message: "FAILED: Job '${env.JOB_NAME} " +
                 "[${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
      )
    }
  }
}
