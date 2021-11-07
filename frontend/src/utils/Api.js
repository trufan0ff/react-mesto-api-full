class Api {
    constructor({baseUrl, headers}) {
        this._url = baseUrl
        this._headers = headers
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            headers: this._headers
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    addCard(name, link) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._headers,
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
            headers: this._headers
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    updateProfile(name, about) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
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
            headers: this._headers
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    setLikeForCard(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: this._headers
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    removeLikeFromCard(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        })
        .then(res => {
            return this._resultStatus(res)
        })
    }

    updateAvatar(link) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
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
    headers: {
        'Content-Type': 'application/json'
    }
})
export default api;