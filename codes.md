#Migrations

##Criar Migrations

yarn sequelize migration:create --name=*INSIRA O NOME AQUI*

##Rodar Migrations

yarn sequelize db:migrate

##Desfazer migrations

###desfazer uma migration

yarn sequelize db:migrate:undo

###desfazer todas as migrations

yarn sequelize db:migrate:undo:all