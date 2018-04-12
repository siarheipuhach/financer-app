const devHost = 'http://localhost:8080/'
const prodHost = 'https://financerapp.herokuapp.com/'
const host = prodHost
const config = {
    url: host,
    loginUrl: host + 'users/login',
    registrationUrl: host + 'users/register',
    checkIfloggedInUrl: host + 'users/isloggedin',
    logoutUrl: host + 'users/logout',
    getItemListUrl: host + 'items/list',
    editItemUrl: host + 'items/',
    addItemUrl: host + 'items/add',
    deleteUrl: host + 'items/remove'
}

module.exports = config;