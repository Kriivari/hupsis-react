#!/bin/sh

echo $1
perl -pi -e 's/version=\"[0-9.]*\"/version=\"$1\"/' config.xml
#cordova build ios --release -- --codeSignIdentity="Apple Development" --developmentTeam=PA5L7CVSC8 --packageType=app-store --automaticProvisioning=true
#perl -pi -e 's/eu.hupsis.Hupsis/eu.hupsis.hupsis/' config.xml
#cordova build android --release -- --keystore=/Users/killer/AndroidStudioProjects/keystore --alias=upload --storePassword=HupsisStore --password=HupsisStore --packageType=bundle
#perl -pi -e 's/eu.hupsis.hupsis/eu.hupsis.Hupsis/' config.xml
