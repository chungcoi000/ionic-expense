import {
  IonButton,
  IonContent, IonDatetime,
  IonHeader,
  IonInput,
  IonItem, IonLabel,
  IonPage, IonPopover, IonSelect, IonSelectOption, IonTextarea,
  IonTitle, IonToast,
  IonToolbar
} from "@ionic/react";
import React, {useEffect, useMemo, useState} from "react";
import "./TripDetail.css";
import {Form, Formik, FormikHelpers} from "formik";
import * as yup from "yup";
import {addTrip, getTripById, updateTripById} from "../../databaseHandler";
import {useHistory, useLocation} from "react-router";
import {Trip} from "../../models/Trip";
import queryString from "query-string";

const validationSchema = yup.object({
  destination: yup
    .string()
    .nullable()
    .required("Email is required"),
  name: yup
    .string()
    .nullable()
    .required("Name is required"),
  date: yup
    .string()
    .nullable()
    .required("Date is required"),
  duration: yup
    .number()
    .nullable()
    .required("Date is required"),
});

const TripDetail: React.FC = () => {
  const [date, setDate] = useState<string>();
  const [risk, setRisk] = useState<string>("no");
  const [open, setOpen] = useState<boolean>(false);
  const [trip, setTrip] = useState<Trip>({});

  const history = useHistory();
  const location = useLocation();

  const id = useMemo(() => {
    const tripId = queryString.parse(location.search)._id;
    return Number(tripId);
  }, [location.search]);


  useEffect(() => {
    (async () => {
      const data = await getTripById(id);
      if (data) {
        setTrip(data);
        setDate(data.date);
        setRisk(data.risk)
      }
    })();
  }, [id]);

  const dateSelectedHandler = (e: any) => {
    const selectedDate = new Date(e.detail.value);
    setDate(selectedDate.toLocaleDateString("en-GB"));
  }

  const riskHandler = (e: any) => {
    setRisk(e.detail.value);
  }

  const updateDetail = async (values: any) => {
    let tripInfo = {...values, risk};
    console.log("tripInfo", tripInfo);
    console.log("id", id);

    await updateTripById(id, tripInfo);

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Update trip</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{margin: "10px", display: "flex", justifyContent: "start"}}>
          <IonButton size="small" onClick={() => history.goBack()}>Back</IonButton>
        </div>
        <div style={{margin: "10px"}}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              destination: trip?.destination,
              name: trip?.name,
              date: trip?.date,
              duration: trip?.duration,
              description: trip?.description,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              updateDetail(values).then(() => {
              })
            }}
          >
            {formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                <IonItem>
                  <IonLabel position="floating">
                    Name
                  </IonLabel>
                  <IonInput
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formikProps.values.name}
                    onIonChange={formikProps.handleChange}
                  />
                </IonItem>
                <p className="error">
                  {formikProps.touched.name && formikProps.errors.name}
                </p>
                <IonItem>
                  <IonLabel position="floating">
                    Destination
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Destination"
                    name="destination"
                    value={formikProps.values.destination}
                    onIonChange={formikProps.handleChange}
                  />
                </IonItem>
                <p className="error">
                  {formikProps.touched.destination && formikProps.errors.destination}
                </p>
                <IonItem>
                  <IonLabel position="floating">
                    Date
                  </IonLabel>
                  <IonInput
                    name="date"
                    value={date}
                    onIonChange={formikProps.handleChange}
                    id='date'
                    placeholder="Date"
                  />
                  <IonPopover keepContentsMounted={true} trigger='date' event='click'>
                    <IonDatetime onIonChange={e => dateSelectedHandler(e)}></IonDatetime>
                  </IonPopover>
                </IonItem>
                <p className="error">
                  {formikProps.touched.date && formikProps.errors.date}
                </p>
                <IonItem>
                  <IonLabel position="floating">
                    Duration
                  </IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Duration"
                    name="duration"
                    value={formikProps.values.duration}
                    onIonChange={formikProps.handleChange}
                  />
                </IonItem>
                <p className="error">
                  {formikProps.touched.duration && formikProps.errors.duration}
                </p>

                <IonItem>
                  <IonLabel position="floating">Risk</IonLabel>
                  <IonSelect
                    name="risk"
                    value={risk}
                    onIonChange={e => riskHandler(e)}
                  >
                    <IonSelectOption value="yes">Yes</IonSelectOption>
                    <IonSelectOption value="no">No</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">
                    Description
                  </IonLabel>
                  <IonTextarea
                    value={formikProps.values.description}
                    placeholder="Description"
                    name="description"
                    onIonChange={formikProps.handleChange}
                  ></IonTextarea>
                </IonItem>
                <IonButton style={{margin: "20px"}} color="tertiary" expand="block" type="submit">UPDATE</IonButton>
              </Form>
            )}
          </Formik>
        </div>

        <IonToast
          isOpen={open}
          onDidDismiss={() => setOpen(false)}
          message="Update trip successfully!"
          duration={2000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  )
    ;
};

export default TripDetail;
