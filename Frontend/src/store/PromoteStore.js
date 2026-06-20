
import { create } from "zustand";
import { getClasses, getSectionsByClass, promoteStudent } from "../api/resultApi";


const usePromoteStore = create((set, get) => ({
    classes:[],
    sections:[],

    selectedClass: null,
    selectedSection: null,

    loading: false,
    error: null,

    initialfetch:async () => {
        try {
           const classRes = await getClasses();
           set({ classes: classRes.data.classes });          
        } catch (error) {
            set({ error: error.message });
        }
    },

    setSelectedClass:async (cls)=>{
        set({selectedClass:cls, selectedSection:null});
        try {
            const res = await getSectionsByClass(cls.class_id);
            console.log(res)
            set({sections:res.data});
        } catch (error) {
           set({ error: error.message }); 
        }
    },
    setSelectedSection: (sec) => {
        set({selectedSection:sec})
    },

    promoteStd: async (students, roll_no) => {
        const {selectedClass, selectedSection} = get();
        try {
            const res = await promoteStudent(students.student_id,selectedClass.class_id, selectedSection.section_id, roll_no); 
        } catch (error) {
           set({ error: error.message }); 
        }
    }

}));

export default usePromoteStore