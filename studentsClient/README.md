# students-client

Front end aplikacija za predmet Tehnolgoije i sistemi eObrazovanja

## Pokretanje aplikacije

*Postaviti dist u Gruntfile.js na putanju do static foldera u Spring Boot aplikaciji

  '''var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'D:/nastava/2015-2016/letnjiSemestar/eNastava/ws/students/static'
  };'''

*`grunt --force buildDev` deplojuje aplikaciju na zadatu putanju bez minimizacije i uglifikacije.

*`grunt --force build` deplojuje aplikaciju na zadatu putanju uz minimizaciju i uglifikaciju.

## Testiranje

*Pokretanje `grunt test` će izvršiti karma testove.
*Testovi u aplikaciji su jedino oni koje je izgenerisao yeoman
