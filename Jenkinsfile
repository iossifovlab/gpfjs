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
        sh "rm -rf node_modules package-lock.json"
        sh "npm install"
      }
    }
    stage('gpfjs build loop') {
      steps {
        script {
            def prefixes = ['gpf19', 'gpf38', 'gpfjs']
            def directories = ['gpf19', 'gpf38', 'static/gpfjs']
            def environments = ['hg19', 'hg38', 'production']
            for(int i=0; i<prefixes.size(); i++) {
                def prefix = prefixes[i]
                def directory = directories[i]
                def env = environments[i]
                
                sh "rm -rf dist/"
                sh "ng build --prod --aot --configuration '${env}' --base-href '/${prefix}/' --deploy-url '/${directory}/'"
                sh "python ppindex.py"
                sh "cd dist/gpfjs && tar zcvf ../../gpfjs-dist-${prefix}.tar.gz . && cd -"
                
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
      script {
        def prefixes = ['gpf19', 'gpf38', 'gpfjs']
        for(int i=0; i<prefixes.size(); i++) {
          def prefix = prefixes[i]
          archive "gpfjs-dist-${prefix}.tar.gz"
          fingerprint "gpfjs-dist-${prefix}.tar.gz"
        }
      }
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
