import React, {useEffect, useState} from "react";
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader, IonIcon, IonItem, IonLabel, IonList,
  IonPage,
  IonTitle, IonToast,
  IonToolbar, useIonAlert
} from '@ionic/react';
import './Home.css';
import {add, trashOutline} from "ionicons/icons";
import {Trip} from "../../models/Trip";
import {deleteTripById, getAllTrips} from "../../databaseHandler";
import {useHistory} from "react-router";
import queryString from "query-string";

const Home: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const fetchTrips = async () => {
    const data = await getAllTrips();
    setTrips(data);
  }

  useEffect(() => {
    fetchTrips().then(_ => {
    });
  }, []);

  const deleteTrip = async (id: any) => {
    presentAlert({
      header: "Are you sure to delete this trip?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          role: "confirm",
          handler: async () => {
            await deleteTripById(id);
            setShow(true);
            const newTripsList = trips.filter(trip => trip.id !== id)
            setTrips(newTripsList);
          },
        },
      ],
    }).then(() => {
    });
  }

  const navigatePage = (id: any) => {
    history.push("/trip");
    history.replace({ search: queryString.stringify({ _id: id }) });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>M-expense</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {
            trips.length > 0 && trips.map((trip) => {
              return (
                <IonItem key={trip.id} lines="none" onClick={() => navigatePage(trip.id)}>
                  <IonLabel style={{marginLeft: "10px"}}>
                    <h2>{trip.name}</h2>
                    <p>{trip.date} - {trip.destination}</p>
                  </IonLabel>
                  <IonButton color="danger" onClick={() => deleteTrip(trip.id)}>
                    <IonIcon icon={trashOutline}/>
                  </IonButton>
                </IonItem>
              )
            })
          }
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton style={{margin: "0 auto"}} routerLink="/add-trip">
            <IonIcon src={add}/>
          </IonFabButton>
        </IonFab>
        <IonToast
          isOpen={show}
          onDidDismiss={() => setShow(false)}
          message="Delete trip successfully!"
          duration={2000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
