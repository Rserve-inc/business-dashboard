git clone git@github.com:Rserve-inc/business-dashboard.git temp
cd temp || exit
npm install
npm run build
# move all dist files to root, overwrite existing files
rm -rf ../assets/*
mv -f dist/* ../
cd ..
