pipeline {
  agent any
  parameters {
    choice(choices: 'gpf\ngpf38\ngpfjs', 
    description: 'web deployment prefix', 
    name: 'webPrefix')
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
    stage('npm install') {
      steps {
        sh "npm install"
      }
    }
    stage('gpfjs build (gpfjs)') {
      steps {
        script {
            def prefixes = ['gpf', 'gpf38', 'gpfjs']
            def directories = ['gpf', 'gpf38', 'static/gpfjs']
            for(int i=0; i<prefixes.size(); i++) {
                def prefix = prefixes[i]
                def directory = directories[i]
                
                sh "ng build --prod --aot -e deploy --bh '/${refix}/' -d '/${directory}/'"
            }
        }
      }
    }

    
    stage('gpfjs build (gpfjs)') {
      when {
        expression { params.webPrefix == "gpfjs" }
      }
      steps {
        sh "ng build --prod --aot -e deploy --bh '/${params.webPrefix}/' -d '/static/${params.dirPrefix}/'"
      }
    }
    stage('gpfjs build (gpf or gpf38)') {
      when {
        expression { params.webPrefix == 'gpf'  || params.webPrefix == 'gpf38' }
      }
      steps {
        sh "ng build --prod --aot -e deploy --bh '/${params.webPrefix}/' -d '/${params.dirPrefix}/'"
      }
    }
    stage('gpfjs archive') {
      steps {
        sh "python ppindex.py"
        sh "cd dist/ && tar zcvf ../gpfjs-dist-${params.webPrefix}.tar.gz . && cd -"
        
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
      archive "gpfjs-dist-${params.webPrefix}.tar.gz"
      fingerprint "gpfjs-dist-${params.webPrefix}.tar.gz"
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
