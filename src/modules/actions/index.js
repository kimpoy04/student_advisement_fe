import { r } from "../../shared/custom-react-native";

async function api(url, method, params = {}) {
  return new Promise((resolve) => {
    r.request({
      method: method,
      url: url,
      params: params,
      onSuccess: (e) => {
        resolve(e);
      },
    });
  });
}

export async function get_courses(params) {
  return await api("/courses", "get", params);
}

export async function get_subjects(params) {
  return await api("/subjects", "get", params);
}

export async function get_users(params) {
  return await api("/users", "get", params);
}

export async function get_grades(params) {
  return await api("/grades", "get", params);
}

//////Data Processing
//get_obj_by_id
export function gobi(arr = [], key, id) {
  const a = arr.filter((b) => b[key] == id);
  return a[0];
}

//Get Subjects Not Yet Taken

export function subjects_not_yet_taken(student) {
  return new Promise(async (resolve) => {
    const { year_level, course_id, id } = student;

    const required_subjects = await get_subjects({
      "filter[where][year_level]": year_level,
      "filter[where][course_id]": course_id,
    });

    const enrolled_subjects = await get_grades({
      "filter[where][user_id]": id,
    });

    const not_yet_taken = await get_subjects_not_yet_taken(
      required_subjects,
      enrolled_subjects
    );
    resolve(not_yet_taken);
  });
}
async function get_subjects_not_yet_taken(
  required_subjects,
  enrolled_subjects
) {
  return new Promise((resolve) => {
    if (required_subjects.length == 0) {
      resolve([]);
    }

    let arr = [];
    required_subjects.map((item, index) => {
      const is_existing = enrolled_subjects.filter(
        (i) => i.subject_id == item.id
      );

      if (is_existing.length > 0) {
      } else {
        arr.push(item);
      }

      if (required_subjects.length == index + 1) {
        resolve(arr);
      }
    });
  });
}

export function get_ordinal(num = "") {
  if (num == "1") {
    return "1ST";
  } else if (num == "2") {
    return "2ND";
  } else if (num == "3") {
    return "3RD";
  } else if (num == "4") {
    return "4TH";
  } else {
    return num + "TH";
  }
}

//Get Enrolled Subjects

export function subjects_taken(student) {
  return new Promise(async (resolve) => {
    const { year_level, course_id, id } = student;

    const required_subjects = await get_subjects({
      "filter[where][year_level]": year_level,
      "filter[where][course_id]": course_id,
    });

    const enrolled_subjects = await get_grades({
      "filter[where][user_id]": id,
    });

    const taken = await get_enrolled_subjects(
      required_subjects,
      enrolled_subjects
    );
    resolve(taken);
  });
}

async function get_enrolled_subjects(required_subjects, enrolled_subjects) {
  return new Promise((resolve) => {
    if (required_subjects.length == 0) {
      resolve([]);
    }

    let arr = [];
    required_subjects.map((item, index) => {
      const is_existing = enrolled_subjects.filter(
        (i) => i.subject_id == item.id
      );

      if (is_existing.length > 0) {
        arr.push(is_existing[0]);
      } else {
      }

      if (required_subjects.length == index + 1) {
        resolve(arr);
      }
    });
  });
}
