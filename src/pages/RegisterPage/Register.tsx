import React, { useState } from 'react';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonRouterLink, IonInput, IonButton, IonText } from '@ionic/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom'; // Importa useHistory

import './Register.css'; 


const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const history = useHistory(); // Usamos el hook useHistory para la redirección

    const handleRegister = async () => {
        // Verificación de confirmación de contraseña
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden', { position: "bottom-center" });
            return;
        }

        try {
            const response = await axios.post(`https://api-notepad-production.up.railway.app/register`, {
                name,
                lastName,
                username,
                email,
                password
            });
            console.log("Usuario registrado:", response.data);
            toast.success("Usuario registrado con éxito", {
                position: "bottom-center"
            });

            setTimeout(() => {
                history.push('/login'); // Redirige a la página de login
            }, 3000);

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.msg, {
                    position: "bottom-center"
                });
            } else {
                toast.error('Error al registrar usuario', {
                    position: "bottom-center"
                });
            }
            console.error("Error en registro:", error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">DePelis!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="container"> {/* Añadimos la clase container */}
                <div className='ion-header'>
                    <h1 className="login-title">Crear cuenta</h1>
                    <label className="login-subtitle">Únase a nuestra comunidad y experimente una búsqueda perfecta de peliculas</label>
                </div>
                <div className='inputs-container'>
                    <div className="input-groups">
                        <IonInput
                        label='Nombre' 
                        fill='solid'
                        labelPlacement="floating"
                            className="login-input"
                            placeholder="Ingrese su nombre" 
                            value={name} 
                            onIonChange={(e) => setName(e.detail.value!)} 
                        />

                    
                        <IonInput 
                        label='Apellido'
                        fill='solid'
                        labelPlacement="floating"
                            className="login-input"
                            placeholder="Ingrese su apellido" 
                            value={lastName} 
                            onIonChange={(e) => setLastName(e.detail.value!)} 
                        />
                    </div>
                    <div className="input-group">
                        <IonInput 
                        label='Usuario'
                        fill='solid'
                        labelPlacement="floating"
                            placeholder="Ingrese un nombre de usuario" 
                            value={username} 
                            onIonChange={(e) => setUsername(e.detail.value!)} 
                        />
                    </div>
                    <div className="input-group">
                        <IonInput 
                        label='Email'
                        fill='solid'
                        labelPlacement="floating"
                            placeholder="Ingrese su correo electrónico" 
                            value={email} 
                            onIonChange={(e) => setEmail(e.detail.value!)} 
                        />
                    </div>
                    <div className="input-group">
                        <IonInput 
                        label='Contraseña'
                        fill='solid'
                        labelPlacement="floating"
                            placeholder="Ingrese una contraseña" 
                            type="password" 
                            value={password} 
                            onIonChange={(e) => setPassword(e.detail.value!)} 
                        />
                    </div>
                    <div className="input-group">
                        <IonInput 
                        label='Confirmacion'
                        fill='solid'
                        labelPlacement="floating"
                            placeholder="Confirme la contraseña" 
                            type="password" 
                            value={confirmPassword} 
                            onIonChange={(e) => setConfirmPassword(e.detail.value!)} 
                        />
                    </div>
                </div>
                <ToastContainer />
                <div>
                    <IonButton color='dark' expand='block' onClick={handleRegister}>Registrar</IonButton>
                    <IonText>
                        <p className='smalltext'>
                            ¿Ya tienes cuenta? <IonRouterLink href="/login">Iniciar sesión</IonRouterLink>
                        </p>
                    </IonText>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;
