# Clubhouse

An exclusive clubhouse project that make use of passport.js to implement authentication.

## Table of Contents
+ [General Information](#general-info)
+ [Technologies](#technologies)
+ [Setup](#setup)
+ [How to Use](#how-to-use)
+ [Demo](#demo)
+ [Features](#features)
+ [Liscence](#liscence)

## General info
This project is a simple clubhouse where you can read and share anonymous posts. Anyone who visits the site can see
the posts shared by others but you cannot see the author of the post unless you are the member of the clubhouse. To
become the member of the clubhouse, you must have the secret passcode, and to share a post you must be signed in.

## Technologies
+ node: 16.15.1
+ express: ^4.18.2
+ ejs: ^3.1.8
> to see all packages, go to package.json file

## Setup
To run this project,

```
#clone this repository
git clone https://github.com/Tanishka-2000/members-only

#Go into the repository
cd members-only

#install dependencies
npm install

```

## How to use
+ Create .env file in the root directory
+ Add a variable named 'Secret' and give it a random value to be used as session secret, e.g.- SECRET=keyboardcat
+ Add a varible named 'MONGODBURL' and give a value equal to your database url (either local database or cloud database)
+ Add two more variables named 'MEMBER_CODE' and 'ADMIN_CODE' and give them random value as well, which will be used as passcode.
now you are all set

```
#run the app
npm start

#or run the app with nodemon
npm run dev

```

## Demo
Here is a working live demo: [https://members-only-p9vl.onrender.com](https://members-only-p9vl.onrender.com).

## Features
+ Home page shows all posts shared but not the author of any post.
+ You need to be signed in share your post.
+ Only members of the clubhouse can see the author and date of each post shared.
+ To become a member you need to know the passcode and enter it in a secret route 'member-log-in'.
+ The admins of the clubhouse can not only see the author and date of the posts but can also delete any post.
+ To become an admin you need to know another passcode and enter it in a secret route 'admin-log-in'.

### Secret Routes
+ Member login: [https://members-only-p9vl.onrender.com/member-log-in](https://members-only-p9vl.onrender.com/member-log-in).
+ Admin login: [https://members-only-p9vl.onrender.com/admin-log-in](https://members-only-p9vl.onrender.com/admin-log-in).

### Roles
| Role  | See post |share post | See Author and date | delete Post |
|------ |----------|-----------|---------------------|-------------|
|visitor|   yes    |    no     |          no         |      no     |
|user   |   yes    |   yes     |          no         |      no     |
|member |   yes    |   yes     |         yes         |      no     |
|admin  |   yes    |   yes     |         yes         |     yes     |

## Liscence
ISC