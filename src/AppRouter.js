import React from "react";
import { Route, Switch } from "react-router-dom";
import Template from "./modules/template/";
import Login from "./modules/login";
import Registration from "./modules/registration";
import AdminCourses from "./modules/admin-courses";
import AdminAddCourse from "./modules/admin-add-course";
import AdminEditCourse from "./modules/admin-edit-course";
import AdminSubjects from "./modules/admin-subjects";
import AdminEditSubject from "./modules/admin-edit-subject";
import AdminAddSubject from "./modules/admin-add-subject";
import AdminStudentRecords from "./modules/admin-student-records";
import AdminViewStudent from "./modules/admin-view-student";
import AdminSummarySubjects from "./modules/admin-summary-subjects";
import StudentProfile from "./modules/student-profile";
import StudentEnrolledSubjects from "./modules/student-enrolled-subjects";
import StudentNotYetTaken from "./modules/student-not-yet-taken";

function AppRouter() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/registration" component={Registration} />
      <Route exact path="/admin/courses" component={AdminCourses} />
      <Route exact path="/admin/courses/add" component={AdminAddCourse} />
      <Route exact path="/admin/courses/edit/:id" component={AdminEditCourse} />
      <Route exact path="/admin/courses/edit" component={AdminCourses} />
      <Route exact path="/admin/subjects" component={AdminSubjects} />
      <Route exact path="/admin/subjects/add" component={AdminAddSubject} />
      <Route
        exact
        path="/admin/subjects/edit/:id"
        component={AdminEditSubject}
      />
      <Route exact path="/admin/subjects/edit" component={AdminSubjects} />
      <Route
        exact
        path="/admin/student-records"
        component={AdminStudentRecords}
      />
      <Route
        exact
        path="/admin/student-records/:id"
        component={AdminViewStudent}
      />
      <Route
        exact
        path="/admin/summary-of-subjects"
        component={AdminSummarySubjects}
      />

      <Route exact path="/student/profile" component={StudentProfile} />
      <Route exact path="/student/enrolled-subjects" component={StudentEnrolledSubjects} />
      <Route exact path="/student/not-yet-taken" component={StudentNotYetTaken} />
      <Route component={Login} />
    </Switch>
  );
}

export default AppRouter;
