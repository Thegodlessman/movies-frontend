import React, { useState } from 'react';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonIcon, IonLabel, IonText } from '@ionic/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import './Login.css';


// commit de sophia

const Login: React.FC = () => {
    const [loginValue, setLoginValue] = useState(''); 
    const [password, setPassword] = useState('');

    const history = useHistory();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://api-notepad-production.up.railway.app/login', {
                loginValue, 
                password
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            toast.success('Inicio de sesión exitoso', {
                position: "bottom-center"
            });

            setTimeout(() => {
                history.push('/home'); // Redirige a la página de login
            }, 3000); // 3000 ms = 3 segundos

        } catch (error: any) {
            toast.error('Error al iniciar sesión', {
                position: "bottom-center"
            });
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">DePelis!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div>
                    <div className="ion-header">
                        <h1 className="login-title">Iniciar Sesion</h1>
                        <label className="login-subtitle">Únase a nuestra comunidad y experimente una búsqueda perfecta de peliculas</label>
                    </div>
                    <div className="ion-item">
                        <IonInput
                            label='Email'
                             fill='solid'
                        labelPlacement="floating"
                            placeholder="Ingresa tu email"
                            value={loginValue}
                            onIonChange={(e) => setLoginValue(e.detail.value!)}
                        />
                    </div>
                    <div className='ion-item'>
                        <IonInput
                            label='Contraseña'
                        fill='solid'
                        labelPlacement="floating"
                            type="password"
                            placeholder="Ingrea tu contraseña"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        />
                    </div>
                    
                </div>
                <IonButton color='dark' expand='block' onClick={handleLogin}>Iniciar sesión</IonButton>
                <IonText>
                    <p className='smalltext'>
                        ¿Aun no tiene cuenta? <a href="/register">Registrate</a>
                    </p>
                </IonText>

                <ToastContainer />
            </IonContent>
        </IonPage>
    );
};

export default Login;
