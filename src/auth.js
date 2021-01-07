export function getAuthForm() {
    return `
            <!-- auth form -->
            <form class="mui-form" id="auth-form">
                <div class="mui-textfield mui-textfield--float-label">
                    <input type="email" id="email" required>
                    <label for="email">Email</label>
                </div>
                <div class="mui-textfield mui-textfield--float-label">
                    <input type="password" id="password" required>
                    <label for="password">Password</label>
                </div>
                <button
                        type="submit"
                        class="mui-btn mui-btn--raised mui-btn--primary"
                >
                    Войти
                </button>
            </form>
            `
}

export function authWithEmailAndPassword(email, password) {
    // sing in with email and password
    // link from firebase api documentation
    // https://firebase.google.com/docs/reference/rest/auth
    // apikey is from project settings
    const apiKey = 'AIzaSyAvacOOTLtKglk6GR8pJpddu6qPg_9_zSI'
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({email: email, password: password, returnSecureToken: true}),
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-cache',
        redirect: 'follow'
    })
        .then(response => response.json())
        .then(data => data.idToken)
        .catch(e => console.error(e))
}