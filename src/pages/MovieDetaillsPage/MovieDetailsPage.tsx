import React, { useEffect, useState } from "react";

import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    IonText,
    IonButtons,
    IonBackButton,
    IonButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonInput,
    IonList, 
    IonSegment, 
    IonSegmentContent,
    IonSegmentButton
} from "@ionic/react";

import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import jwt_decode from "jwt-decode";

import 'react-toastify/dist/ReactToastify.css';
import './MovieDetailsPage.css'


interface Movie {
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    overview: string;
    genres: { id: number; name: string }[];
    runtime: number;
}

interface Comment {
    userId: string;
    comment: string;
    rating: number;
    createdAt: string;
}

const MovieDetailsPage: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [userComment, setUserComment] = useState<string>("");
    const [userRating, setUserRating] = useState<number>(5);
    const [existingComment, setExistingComment] = useState<Comment | null>(null);

    const getUserIdFromToken = (): string | null => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwt_decode(token);
                return decoded.id;
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        }
        return null;
    };

    const getUsernameFromToken = (): string | null => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwt_decode(token);
                return decoded.username;  // Asegúrate de que el token tenga el campo `username`
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        }
        return null;
    };

    const userId = getUserIdFromToken();
    const username = getUsernameFromToken();

    const fetchMovieDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api-notepad-production.up.railway.app/movies/${movieId}`);
            setMovie(response.data);
            await checkIfFavorite();
        } catch (error) {
            console.error("Error fetching movie details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`https://api-notepad-production.up.railway.app/comments/${movieId}`);
            setComments(response.data);
            const userComment = response.data.find((comment: Comment) => comment.userId === userId);
            if (userComment) setExistingComment(userComment);
        } catch (error) {
            toast.error("Error al cargar comentarios", { position: "bottom-center" });
        }
    };

    const checkIfFavorite = async () => {
        try {
            const response = await axios.get(`https://api-notepad-production.up.railway.app/favorites/${userId}`);
            setIsFavorite(response.data.some((fav: any) => fav.movieId === movieId));
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };

    const addToFavorites = async () => {
        if (!movie) return;

        try {
            await axios.post("https://api-notepad-production.up.railway.app/favorites", {
                userId,
                movieId,
                title: movie.title,
                posterPath: movie.poster_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average,
                genres: movie.genres.map(genre => genre.name),
            });
            setIsFavorite(true);
            toast.success("Película guardada.", { position: "bottom-center" });
        } catch (error) {
            toast.error("Error al guardar en favoritos.", { position: "bottom-center" });
        }
    };

    const removeFromFavorites = async () => {
        try {
            await axios.delete("https://api-notepad-production.up.railway.app/favorites", {
                data: { userId, movieId }
            });
            setIsFavorite(false);
            toast.success("Película eliminada de guardados.", { position: "bottom-center" });
        } catch (error) {
            toast.error("Error al eliminar de favoritos.", { position: "bottom-center" });
        }
    };

    const handleAddOrUpdateComment = async () => {
        if (userComment.length > 240) {
            toast.error("El comentario no debe superar los 240 caracteres");
            return;
        }
        if (userRating < 1 || userRating > 10) {
            toast.error("La valoración debe estar entre 1 y 10");
            return;
        }
        
        try {
            await axios.post("https://api-notepad-production.up.railway.app/comments", {
                movieId,
                userId,
                username,  // Asegúrate de enviar el username
                comment: userComment,
                rating: userRating
            });
    
            toast.success("Comentario añadido con éxito", { position: "bottom-center" });
            setUserComment("");
            setUserRating(5);
            fetchComments();
        } catch (error) {
            toast.error("Error al añadir comentario", { position: "bottom-center" });
        }
    };

    const handleDeleteComment = async () => {
        try {
            await axios.delete(`https://api-notepad-production.up.railway.app/comments/${movieId}/${userId}`);
            toast.success("Comentario eliminado", { position: "bottom-center" });
            setExistingComment(null);
            setUserComment("");
            setUserRating(5);
            fetchComments();
        } catch (error) {
            toast.error("Error al eliminar comentario", { position: "bottom-center" });
        }
    };

    useEffect(() => {
        fetchMovieDetails();
        fetchComments();
    }, [movieId]);

    return (
        <IonPage>
            <IonToolbar style={{ padding: "0.8rem" }}>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/"/>
                </IonButtons>
                <IonTitle className="ion-title">Detalles</IonTitle>
            </IonToolbar>
            <IonContent>
                <ToastContainer />
                {loading ? (
                    <IonSpinner />
                ) : movie ? (
                    <div style={{ padding: "1rem" }}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                        <h2>{movie.title}</h2>
                        <IonSegment value="all">
                            <IonSegmentButton value="all">
                                <IonLabel>Info</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="favorites">
                                <IonLabel>Comentarios</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        <IonText color="medium">
                            <p>Estreno: {new Date(movie.release_date).toLocaleDateString()}</p>
                            <p>Valoración: {movie.vote_average} / 10 ({movie.vote_count} votos)</p>
                        </IonText>

                        <h3>Géneros</h3>
                        <IonText color="primary">
                            {movie.genres.map(genre => (
                                <span key={genre.id} style={{ marginRight: "8px", color: "black" }}>{genre.name}</span>
                            ))}
                        </IonText>

                        <h3>Resumen</h3>
                        <IonText>
                            <p>{movie.overview}</p>
                        </IonText>

                        <IonButton expand="block" onClick={isFavorite ? removeFromFavorites : addToFavorites}>
                            {isFavorite ? "Colocar en Guardados" : "Quitar de Guardados"}
                        </IonButton>

                        <h3>Deja un comentario</h3>
                        <IonItem>
                            <IonTextarea
                                value={userComment}
                                onIonChange={(e) => setUserComment(e.detail.value!)}
                                maxlength={240}
                                placeholder="Escribe un comentario (máx 240 caracteres)"
                            />
                        </IonItem>
                        <IonItem>
                            <IonInput
                                type="number"
                                placeholder="Ingrese su valoración"
                                value={userRating}
                                onIonChange={(e) => setUserRating(Number(e.detail.value))}
                                min={1}
                                max={10}
                            />
                        </IonItem>
                        <IonButton expand="block" onClick={handleAddOrUpdateComment}>
                            {existingComment ? "Actualizar comentario" : "Enviar comentario"}
                        </IonButton>
                        {existingComment && (
                            <IonButton expand="block" color="danger" onClick={handleDeleteComment}>
                                Eliminar comentario
                            </IonButton>
                        )}

                        <h3>Comentarios</h3>
                        <IonList>
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <IonItem key={index}>
                                        <IonLabel>
                                            <h2>{}</h2>
                                            <h3>Valoración: {comment.rating}/10</h3>
                                            <p>{comment.comment}</p>
                                            <p><small>{new Date(comment.createdAt).toLocaleDateString()}</small></p>
                                        </IonLabel>
                                    </IonItem>
                                ))
                            ) : (
                                <p>No hay comentarios disponibles</p>
                            )}
                        </IonList>
                    </div>
                ) : (
                    <IonText color="danger">Error al cargar los detalles de la película.</IonText>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MovieDetailsPage;
