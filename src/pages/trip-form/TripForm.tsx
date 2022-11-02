import {
  IonButton, IonCol,
  IonContent, IonDatetime, IonGrid,
  IonHeader,
  IonInput,
  IonItem, IonLabel, IonModal,
  IonPage, IonPopover, IonRow, IonSelect, IonSelectOption, IonTextarea,
  IonTitle, IonToast,
  IonToolbar
} from "@ionic/react";
import React, {useState} from "react";
import "./TripForm.css";
import {Form, Formik, FormikHelpers, FormikValues} from "formik";
import * as yup from "yup";
import {addTrip} from "../../databaseHandler";
import {useHistory} from "react-router";

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
    .required("Duration is required"),
  contact: yup
    .string()
    .nullable()
    .required("Contact is required"),
});

const TripForm: React.FC = () => {
  const [date, setDate] = useState<string>();
  const [risk, setRisk] = useState<string>("no");
  const [open, setOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [value, setValue] = useState<any>();
  const [reset, setReset] = useState<any>();
  const history = useHistory();

  const dateSelectedHandler = (e: any) => {
    const selectedDate = new Date(e.detail.value);
    setDate(selectedDate.toLocaleDateString("en-GB"));
  }

  const riskHandler = (e: any) => {
    setRisk(e.detail.value);
  }

  console.log("values", value);

  const tripDetail = (values: any) => {
    let tripInfo = {...values, risk};
    setValue(tripInfo);
    setModal(true);
  }

  const addTripDetail = async () => {
    if (value) {
      const res = await addTrip(value);
      if (res) {
        setModal(false);
        setOpen(true);
        reset.resetForm();
        setDate("");
        setRisk("no");
        history.push("/home");
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add trip</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{margin: "10px", display: "flex", justifyContent: "start"}}>
          <IonButton size="small" onClick={() => history.goBack()}>Back</IonButton>
        </div>
        <div style={{margin: "10px"}}>
          <Formik
            initialValues={{
              destination: null,
              name: null,
              contact: null,
              date: null,
              duration: null,
              description: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              tripDetail(values);
              setReset(actions);
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
                  <IonLabel position="floating">
                    Contact
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Contact"
                    name="contact"
                    value={formikProps.values.contact}
                    onIonChange={formikProps.handleChange}
                  />
                </IonItem>
                <p className="error">
                  {formikProps.touched.contact && formikProps.errors.contact}
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
                <IonButton style={{margin: "20px"}} color="tertiary" expand="block" type="submit">SAVE</IonButton>
              </Form>
            )}
          </Formik>
        </div>

        <IonModal isOpen={modal} onDidDismiss={() => setModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Confirm Trip</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {
              value && (
                <>
                  <IonItem>
                    <IonLabel>Trip name: {value.name}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Trip destination: {value.destination}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Trip date: {value.date}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Trip duration: {value.duration}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Trip contact: {value.contact}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Trip risk: {value.risk}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Trip description: {value.description}</IonLabel>
                  </IonItem>
                </>
              )
            }
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton style={{display: "flex"}}
                             onClick={() => setModal(false)}>Cancel</IonButton>
                </IonCol>
                <IonCol>
                  <IonButton style={{display: "flex"}} onClick={() => addTripDetail().then(_ => {
                  })}>
                    Save
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={open}
          onDidDismiss={() => setOpen(false)}
          message="Add trip successfully!"
          duration={2000}
          position="top"
          color="success"
        />

      </IonContent>
    </IonPage>
  )
    ;
};

export default TripForm;
