Устанавливаем nodejs:
sudo apt-get update
sudo apt-get install nodejs

Устанавливаем npm:
sudo apt-get install npm

Устанавливаем mongodb stable version:
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org 

Для установки необходимо выполнить: 
npm install

Для запуска сервера:
node bin/www

Основные параметры вынесены в config.json