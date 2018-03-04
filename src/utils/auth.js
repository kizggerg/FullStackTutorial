import Auth0Lock from 'auth0-lock';
import Relay from 'react-relay/classic';
import CreateUser from '../mutations/CreateUser';
import SigninUser from '../mutations/SigninUser';

const authDomain = "gzik.auth0.com";
const clientID = "JUq5V4Pm2Pjv1x6T2VpUQalG9Bw5jAl4";

class AuthService {
    constructor(props) {
        this.lock = new Auth0Lock(clientID, authDomain, {
            auth: {
                params: {
                    scope: 'openid email'
                },
            },
        })

        this.showLock = this.showLock.bind(this);
        this.lock.on('authenticated', this.authProcess.bind(this));
    }

    authProcess = (authResult) => {
        console.log(authResult);
    }

    showLock() {
        this.lock.show();
    }

    setToken = (authFields) => {
        let {
            idToken,
            exp
        } = authFields;

        localStorage.setItem('idToken', idToken);
        localStorage.setItem('exp', exp * 1000);
    }
    
    isCurrent = () => {
        let expString = localStorage.getItem('exp');
        
        if (!expString) {
            localStorage.removeItem('idToken');
            return false;
        }

        let now = new Date();
        let exp = new Date(parseInt(expString, 10));

        if (exp < now) {
            this.logout();
            return false;
        } 
        else {
            return true;
        }
    }

    getToken() {
        let idToken = localStorage.getItem('idToken');

        if (this.isCurrent() && idToken) {
            return idToken;
        }
        else {
            localStorage.removeItem('idToken');
            localStorage.removeItem('exp');
            return false;
        }
    }

    logout = () => {
        localStorage.removeItem('idToken');
        localStorage.removeItem('exp');
        window.location.reload();
    }

    createUser = (authFields) => {
        return new Promise( (resolve, reject) => {
            Relay.Store.commitUpdate(
                new CreateUser({
                    email: authFields.email,
                    idToken: authFields.idToken
                }), {
                    onSuccess: (response) => {
                        this.signinUser(authFields);
                        resolve(response);
                    },
                    onFailure: (response)  => {
                        console.log('CreateUser error', response);
                        reject(response);
                    }
                }
            )
        })
    } 

    signinUser = (authFields) => {
        return new Promise( (resolve, reject) => {
            Relay.Store.commitUpdate(
                new SigninUser({
                    idToken: authFields.idToken
                }), {
                    onSuccess: (response) => {
                        this.setToken(authFields);
                        resolve(response);
                    },
                    onFailure: (response) => {
                        reject(response);
                    }
                }
            )
        })
    }
}

const auth = new AuthService();

export default auth;