const URL = 'https://api.sunrise-mesto.nomoredomains.rocks';

export const register = (password, email) => {
    return fetch(`${URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ password, email })
    })
        .then(_resultStatus);

};
export const authorize = (email, password) => {
    return fetch(`${URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ email, password })
    })
        .then(_resultStatus)
};

export const getToken = (token) => {
    return fetch(`${URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        
    })
        .then(_resultStatus)
}

const _resultStatus = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}