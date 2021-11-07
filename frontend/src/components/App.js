import "../index.css";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import { useEffect } from "react";
import api from "../utils/Api";
import React from "react";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import Login from "./Login.js";
import Register from "./Register.js";
import * as auth from "../utils/auth";
import InfoToolTip from "./InfoTooltip";
import MenuMobile from "./MenuMobile";



function App() {
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [selectedCard, setSelectedCard] = React.useState(null)
    const [currentUser, setCurrentUser] = React.useState({
        avatar: 'https://github.com/konjvpaljto/mesto/blob/master/src/images/avatar.jpg?raw=true',
        name: 'Жак Ив-Кусто',
        about: 'Исследователь океана',
    })
    const [cards, setCards] = React.useState([]);
    const [userData, setUserData] = React.useState({
        email: "",
    })
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false)
    const [infoToolTipData, setInfoToolTipData] = React.useState({
        title: "",
        icon: "",
    })
    const [isDataSet, setIsDataSet] = React.useState(false)
    const history = useHistory()

    const handleLogin = (email, password) => {
        auth.authorize(email, password)
            .then((res) => {
                if (res.token) {
                    localStorage.setItem("token", res.token)
                    setUserData({ email: email })
                    setLoggedIn(true)
                    setIsMenuOpen(false)
                    history.push("/")
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        
            
            api.getInitialCards(token)
                .then((cards) => {
                    setCards(cards)
                    console.log(cards)
                })
                .catch((err) => {
                    console.log(err)
                })
        
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token');
        api.getUserInfo(token)
            .then(res => {
                setCurrentUser(res)
                setLoggedIn(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [currentUser])

    useEffect(() => {
        if (loggedIn) {
            history.push("/")
        }
    }, [history, loggedIn])

    function handleAddPlaceSubmit({ name, link }) {
        const token = localStorage.getItem('token');
        api.addCard(name, link,token)
            .then(newCard => {
                setCards([newCard, ...cards])
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateUser({ name, about }) {
        const token = localStorage.getItem('token');
        api.updateProfile(name, about,token)
            .then((res) => {
                setCurrentUser(res)
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateAvatar({ avatar }) {
        const token = localStorage.getItem('token');
        api.updateAvatar(avatar,token)
            .then((res) => {
                setCurrentUser(res)
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleCardLike(card) {
        const token = localStorage.getItem('token');
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        (!isLiked ? api.setLikeForCard(card._id,token) : api.removeLikeFromCard(card._id,token))
            .then((newCard) => {
                setCards((state) =>
                    state.map((c) => c._id === card._id ? newCard : c)
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleCardDelete(card) {
        const token = localStorage.getItem('token');
        const isOwn = card.owner._id === currentUser._id;
        api.deleteCard(card._id, isOwn,token)
            .then(res => {
                setCards(cards.filter(item => { return item._id !== card._id }))
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleCardClick(card) {
        setSelectedCard(card)
    }

    const [isEditAvatarPopupOpen, setStateAvatar] = React.useState(false);
    function handleEditAvatarClick() {
        setStateAvatar(true)
    }
    const [isEditProfilePopupOpen, setStateProfile] = React.useState(false);
    function handleEditProfileClick() {
        setStateProfile(true)
    }
    const [isAddPlacePopupOpen, setStatePlace] = React.useState(false);
    function handleAddPlaceClick() {
        setStatePlace(true)
    }

    function closeAllPopups() {
        setStateProfile(false)
        setStatePlace(false)
        setStateAvatar(false)
        setSelectedCard(null)
        setIsInfoToolTipOpen(false)
    }

    const tokenCheck = () => {
        const token = localStorage.getItem("token")
        if (token) {
            auth.getToken(token)
                .then((res) => {
                    if (res) {
                        setUserData({ email: res.data.email })
                        setLoggedIn(true)
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    useEffect(() => {
        tokenCheck()
    }, [])



    const toggleMenu = () => {
        isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true)
    }

    function handleInfoToolTip() {
        setIsInfoToolTipOpen(true)
    }



    const handleLogout = () => {
        localStorage.removeItem("token")
        setUserData({ email: "" })
        setLoggedIn(false)
    }

    const handleRegister = (password, email) => {
        auth.register(password, email)
            .then((res) => {
                setIsDataSet(true)
                history.push("/signin")
                setInfoToolTipData({
                    icon: true,
                    title: "Вы успешно зарегистрировались!",
                });
                handleInfoToolTip();
            })
            .catch(() => {
                setIsDataSet(false);
                setInfoToolTipData({
                    icon: false,
                    title: "Что-то пошло не так! Попробуйте ещё раз.",
                });
                handleInfoToolTip();
            })
            .finally(() => {
                setIsDataSet(false)
            })
    }


    return (
        <CurrentUserContext.Provider value={currentUser}>
            {
                <div className="App" background="#000">
                    <div className="body">
                        <div className="page">
                            {loggedIn && (
                                <MenuMobile
                                    exect
                                    email={userData.email}
                                    handleLogout={handleLogout}
                                    isMenuOpen={isMenuOpen}
                                />
                            )}

                            <Header
                                handleLogout={handleLogout}
                                email={userData.email}
                                toggleMenu={toggleMenu}
                                isMenuOpen={isMenuOpen}
                            />


                            <Switch>

                                <Route path="/signin">
                                    <Login handleLogin={handleLogin} />
                                </Route>

                                <Route path="/signup">
                                    <Register handleRegister={handleRegister} isDataSet={isDataSet} />
                                </Route>

                                <ProtectedRoute
                                    exect
                                    path="/"
                                    loggedIn={loggedIn}
                                    cards={cards}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                                    handleCardClick={handleCardClick}
                                    onEditProfile={handleEditProfileClick}
                                    onAddPlace={handleAddPlaceClick}
                                    onEditAvatar={handleEditAvatarClick}
                                    component={Main}
                                />

                            </Switch>

                            <EditAvatarPopup
                                title={"Обновить аватар"}
                                onClose={closeAllPopups}
                                isOpen={isEditAvatarPopupOpen}
                                onUpdateAvatar={handleUpdateAvatar}
                            />

                            <EditProfilePopup
                                title={"Редактировать профиль"}
                                onUpdateUser={handleUpdateUser}
                                onClose={closeAllPopups}
                                isOpen={isEditProfilePopupOpen}
                            />

                            <AddPlacePopup
                                title={"Новое место"}
                                onClose={closeAllPopups}
                                isOpen={isAddPlacePopupOpen}
                                onAddPlace={handleAddPlaceSubmit}
                            />

                            <ImagePopup
                                handleCardClick={handleCardClick}
                                onClose={closeAllPopups}
                                card={selectedCard}
                            />

                            <InfoToolTip
                                isOpen={isInfoToolTipOpen}
                                onClose={closeAllPopups}
                                title={infoToolTipData.title}
                                icon={infoToolTipData.icon}
                            />

                            <Footer />
                        </div>
                    </div>
                </div>
            }
        </CurrentUserContext.Provider >
    );
}

export default App;
