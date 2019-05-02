pipeline {
  agent any
  stages {
    stage('Lint') {
      steps {
        sh "ng lint --format junit > ts-lint-report.xml || echo \"tslint exited with \$?\""
      }
    }
    stage ('Start') {
      steps {
        slackSend (
          color: '#FFFF00',
          message: "STARTED: Job '${env.JOB_NAME} " +
            "[${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        )
      }
    }
    stage('Setup') {
      steps {
        sh "rm -rf node_modules package-lock.json"
        sh "npm install"
      }
    }
    stage('Test') {
      steps {
        sh "ng test -- --no-watch --no-progress --code-coverage --browsers=ChromeHeadlessCI"
      }
    }
    // stage('Build') {
    //   steps {
    //     script {
    //         def prefixes = ['gpf', 'gpf38', 'gpfjs']
    //         def directories = ['gpf', 'gpf38', 'static/gpfjs']
    //         def environments = ['hg19', 'hg38', 'production']
    //         for(int i=0; i<prefixes.size(); i++) {
    //             def prefix = prefixes[i]
    //             def directory = directories[i]
    //             def env = environments[i]
                
    //             sh "rm -rf dist/"
    //             sh "ng build --prod --aot --configuration '${env}' --base-href '/${prefix}/' --deploy-url '/${directory}/'"
    //             sh "python ppindex.py"
    //             sh "cd dist/gpfjs && tar zcvf ../../gpfjs-dist-${prefix}.tar.gz . && cd -"
                
    //         }
    //     }
    //   }
    // }

  }
  post {
    always {
      step([$class: 'CoberturaPublisher',
           coberturaReportFile: 'coverage/cobertura-coverage.xml'])
      warnings(
        parserConfigurations: [[parserName: 'TsLint',
                               pattern: 'ts-lint-report.xml']],
        excludePattern: '.*site-packages.*'
      )
    }
    success {
      slackSend (
        color: '#00FF00',
        message: "SUCCESSFUL: Job '${env.JOB_NAME} " +
                 "[${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
      )
      // script {
      //   def prefixes = ['gpf', 'gpf38', 'gpfjs']
      //   for(int i=0; i<prefixes.size(); i++) {
      //     def prefix = prefixes[i]
      //     archive "gpfjs-dist-${prefix}.tar.gz"
      //     fingerprint "gpfjs-dist-${prefix}.tar.gz"
      //   }
      // }
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
