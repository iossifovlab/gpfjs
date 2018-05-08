pipeline {
  agent any
  parameters {
    string(defaultValue: 'gpf', description: 'web deployment prefix', name: 'webPrefix', trim: true)
  }
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
        echo "webPrefix: ${params.webPrefix}"
        echo '''webPrefix: ${params.webPrefix}'''

        sh '''
          npm install
          ng build --prod --aot -e deploy --bh '/${params.webPrefix}/' -d '/${params.webPrefix}/'
          python ppindex.py
          cd dist/
          tar zcvf ../gpfjs-dist-${params.webPrefix}.tar.gz .
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
      archive 'gpfjs-dist-${params.webPrefix}.tar.gz'
      fingerprint 'gpfjs-dist-${params.webPrefix}.tar.gz'
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
