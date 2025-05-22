const route = require("express").Router();
const CourseCTL = require("../Controller/CourseCTL");
const multer = require("multer");
const path = require("path");
const LessonCTL = require("../Controller/LessonCTL");
const ChapterCTL = require("../Controller/ChapterCTL");
const SubjectCTL = require("../Controller/SubjectCTL");
const MyCourseCTL = require("../Controller/MyCourseCTL");
const Search = require("../Controller/Search");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/course");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

route.get("/student/increase/:id", CourseCTL.increaseStudent);
route.get("/subject/course/:id", CourseCTL.getBySubjectID);

route.get("/subject/all", SubjectCTL.getAll);
route.post("/subject/add", SubjectCTL.add);
route.get("/subject/detail/:id", SubjectCTL.detail);
route.post("/subject/edit", SubjectCTL.edit);
route.delete("/subject/delete/:id", SubjectCTL.delete);

route.get("/all", CourseCTL.getAll);
route.get("/public/:id", CourseCTL.getPublic);
route.post("/storage", upload.single('image'), CourseCTL.add);
route.get("/:id", CourseCTL.detail);
route.post("/edit", upload.single("image"), CourseCTL.edit);
route.delete("/delete/:id", CourseCTL.delete);

route.get("/chapter/all/:id", ChapterCTL.getChapter);
route.get("/chapter/all", ChapterCTL.getAll);
route.post("/chapter/new", ChapterCTL.addChapter);
route.get("/chapter/course/:id", ChapterCTL.getChapterByCourseId);
route.get("/chapter/detail/:id", ChapterCTL.detail);
route.post("/chapter/edit", ChapterCTL.edit);
route.delete("/chapter/delete/:id", ChapterCTL.delete);

route.get("/lesson/all", LessonCTL.getAll);
route.get("/lesson/all/:id", LessonCTL.getAllByChapter);
route.post("/lesson/new", LessonCTL.addLesson);
route.get("/lesson/detail/:id", LessonCTL.detail);
route.post("/lesson/edit", LessonCTL.edit);
route.delete("/lesson/delete", LessonCTL.delete);

route.get("/my-course/all/:idUser", MyCourseCTL.getAll);
route.post("/my-course/add", MyCourseCTL.addCourse);

route.get("/search/:key", Search.searchCourse);
module.exports = route;