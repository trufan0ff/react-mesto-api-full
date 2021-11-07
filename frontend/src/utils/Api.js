class Api {
    constructor({baseUrl}) {
        this._url = baseUrl
    }

    getInitialCards(token) {
        return fetch(`${this._url}/cards`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    addCard(name, link,token) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

    getUserInfo(token) {
        return fetch(`${this._url}/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    updateProfile(name, about,token) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

    deleteCard(id,token) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    setLikeForCard(cardId,token) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    removeLikeFromCard(cardId,token) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    updateAvatar(link,token) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
    baseUrl: 'api.sunrise-mesto.nomoredomains.rocks',
})
export default api;