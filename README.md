[![Build Status](https://travis-ci.org/utfpr/reservaEquipamentosLab.svg?branch=master)](https://travis-ci.org/utfpr/reservaEquipamentosLab)
[![Waffle.io - Columns and their card count](https://badge.waffle.io/utfpr/reservaEquipamentosLab.png?columns=all)](https://waffle.io/utfpr/reservaEquipamentosLab?utm_source=badge)

# LabControl

## Descrição
Sistema para gerenciamento de reservas de laboratórios e equipamentos laboratoriais, sendo desenvolvido pelos alunos da disciplina Programação de Aplicativos (BCC34F) turma IC4A de 2018/1 da Universidade Tecnológica Federal do Paraná - [UTFPR](http://portal.utfpr.edu.br), para aplicação interna nos cursos: Licenciatura em Química, Engenharia de Alimentos e Engenharia Ambiental, do *campus* Campo Mourão.

#### Desenvolvido com
- [Vue.js](https://vuejs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Firebase](https://firebase.google.com/)


## Configurações
- #### Requisitos
  - NodeJS >= 6.6.0
  - Firebase Project

- #### Como usar
```
 $ git clone https://github.com/utfpr/reservaEquipamentosLab.git
```
```
 $ cd reservaEquipamentosLab/LabControl   # Acessar a pasta LabControl
```
   Altere a variável `config` em `src/firebase-controller.js` para as credencias de acesso de seu projeto Firebase

```
 $ npm install     # Instalar as dependências do projeto
```
```
 $ npm run dev     # Servidor de desenvolvimento
```
```
 $ npm run build   # Montar para produção
```

## Licença
Este projeto se encontra sob a lincença [MIT](http://opensource.org/licenses/MIT)
