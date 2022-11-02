import {
  IonButton,
  IonContent, IonDatetime,
  IonHeader,
  IonInput,
  IonItem, IonLabel, IonModal,
  IonPage, IonPopover, IonSelect, IonSelectOption, IonTextarea,
  IonTitle, IonToast,
  IonToolbar
} from "@ionic/react";
import React, {useState} from "react";
import "./TripForm.css";
import {Form, Formik, FormikHelpers} from "formik";
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
    .required("Date is required"),
});

const TripForm: React.FC = () => {
  const [date, setDate] = useState<string>();
  const [risk, setRisk] = useState<string>("no");
  const [open, setOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [value, setValue] = useState<any>();
  const history = useHistory();

  console.log(value);

  const dateSelectedHandler = (e: any) => {
    const selectedDate = new Date(e.detail.value);
    setDate(selectedDate.toLocaleDateString("en-GB"));
  }

  const riskHandler = (e: any) => {
    setRisk(e.detail.value);
  }

  const addTripDetail = async (values: any, actions: FormikHelpers<any>) => {
    let tripInfo = {...values, risk};
    setValue(tripInfo);
    const res = await addTrip(tripInfo);
    if (res) {
      setOpen(true);
      actions.resetForm();
      setRisk("no");
      setDate("");
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
              date: null,
              duration: null,
              description: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              addTripDetail(values, actions).then(() => {
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
                <IonButton style={{margin: "20px"}} color="tertiary" expand="block" type="submit">SAVE</IonButton>
                <IonModal isOpen={modal} title="Confirm information" onDidDismiss={() => setModal(false)}>
                  <p>Test</p>
                  <IonButton onClick={() => setModal(false)}>Close</IonButton>
                  <IonButton type="submit">Save</IonButton>

                </IonModal>
              </Form>
            )}
          </Formik>
        </div>

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
