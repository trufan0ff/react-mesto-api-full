class Api {
    constructor({baseUrl}) {
        this._url = baseUrl
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    addCard(name, link) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    updateProfile(name, about) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: name,
                about: about
            })
        }) 
        .then(res => {
            return this._resultStatus(res)
        })
    }

    deleteCard(id) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    setLikeForCard(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    removeLikeFromCard(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    updateAvatar(link) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                avatar: link
            })
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    _resultStatus(res) {
        if (res.ok) {
            return res.json()
        }
        return Promise.reject(`Ошибка: ${res.status}`)
    }
}

const api = new Api({
    baseUrl: 'https://api.sunrise-mesto.nomoredomains.rocks',
})
export default api;