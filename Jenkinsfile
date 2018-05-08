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
    stage('npm install') {
      steps {
        sh "npm install"
      }
    }
    stage('gpfjs build loop') {
      steps {
        script {
            def prefixes = ['gpf', 'gpf38', 'gpfjs']
            def directories = ['gpf', 'gpf38', 'static/gpfjs']
            for(int i=0; i<prefixes.size(); i++) {
                def prefix = prefixes[i]
                def directory = directories[i]
                
                sh "rm -rf dist/"
                sh "ng build --prod --aot -e deploy --bh '/${prefix}/' -d '/${directory}/'"
                sh "python ppindex.py"
                sh "cd dist/ && tar zcvf ../gpfjs-dist-${prefix}.tar.gz . && cd -"
                
            }
        }
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
      archive "gpfjs-dist-gpf.tar.gz"
      archive "gpfjs-dist-gpf38.tar.gz"
      archive "gpfjs-dist-gpfjs.tar.gz"
      fingerprint "gpfjs-dist-gpf.tar.gz"
      fingerprint "gpfjs-dist-gpf38.tar.gz"
      fingerprint "gpfjs-dist-gpfjs.tar.gz"
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
