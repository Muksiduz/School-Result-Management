import ClassForm from "../../components/classes/ClassForm";
import ClassTable from "../../components/classes/ClassTable";

import { classes } from "../../data/classes";

function ClassesPage() {
  return (
    <div>
      <ClassTable classes={classes} />
    </div>
  );
}

export default ClassesPage;
