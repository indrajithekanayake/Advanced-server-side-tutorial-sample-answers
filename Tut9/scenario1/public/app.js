(function () {
  var listEl = document.getElementById('student-list');
  var detailsEl = document.getElementById('details-panel');
  var messageEl = document.getElementById('message');
  var addStudentBtn = document.getElementById('add-student-btn');

  var state = {
    apiKey: '',
    students: [],
    activeStudent: null,
    mode: 'welcome'
  };

  function showMessage(message, isError) {
    messageEl.textContent = message || '';
    messageEl.className = isError ? 'message error' : 'message';
    messageEl.style.display = message ? 'block' : 'none';
  }

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  function parseResponse(res) {
    return res.text().then(function (text) {
      var data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          data = { message: text };
        }
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    });
  }

  function api(path, options) {
    options = options || {};
    options.headers = options.headers || {};

    if (state.apiKey) {
      options.headers['x-api-key'] = state.apiKey;
    }

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    return fetch(path, options).then(parseResponse);
  }

  function fetchClientConfig() {
    return fetch('/api/client-config')
        .then(parseResponse)
        .then(function (data) {
          state.apiKey = data.apiKey;
        });
  }

  function loadStudents() {
    return api('/api/students').then(function (response) {
      state.students = response.data || [];
      renderStudentList();
    });
  }

  function renderStudentList() {
    if (!state.students.length) {
      listEl.innerHTML =
          '<div class="empty-card">' +
          '<h2>No Students Yet</h2>' +
          '<p class="empty-state">Click "Add Student" to create your first student record.</p>' +
          '</div>';
      return;
    }

    var html = '<div class="student-list-wrap">';

    state.students.forEach(function (student) {
      html +=
          '<div class="student-card">' +
          '<div class="student-top">' +
          '<div>' +
          '<h3 class="student-name">' + escapeHtml(student.name) + '</h3>' +
          '<p class="student-meta">' +
          escapeHtml(student.email) + '<br>' +
          escapeHtml(student.course) + ' · Year ' + escapeHtml(student.year) +
          '</p>' +
          '</div>' +
          '<div class="student-actions">' +
          '<button class="icon-btn" data-action="view" data-id="' + student.id + '" title="View Student">👁</button>' +
          '<button class="icon-btn" data-action="edit" data-id="' + student.id + '" title="Edit Student">✏️</button>' +
          '<button class="icon-btn" data-action="patch" data-id="' + student.id + '" title="Partial Update">🩹</button>' +
          '<button class="icon-btn" data-action="delete" data-id="' + student.id + '" title="Delete Student">🗑️</button>' +
          '</div>' +
          '</div>' +
          '</div>';
    });

    html += '</div>';
    listEl.innerHTML = html;
  }

  function renderWelcome() {
    detailsEl.innerHTML =
        '<div class="empty-card">' +
        '<h2>Student Details</h2>' +
        '<p class="empty-state">Select a student to view details, or click "Add Student" to create a new one.</p>' +
        '</div>';
  }

  function renderStudentDetails(student) {
    detailsEl.innerHTML =
        '<div class="details-card">' +
        '<h2>Student Details</h2>' +
        '<div class="detail-row"><strong>ID</strong><span>' + escapeHtml(student.id) + '</span></div>' +
        '<div class="detail-row"><strong>Name</strong><span>' + escapeHtml(student.name) + '</span></div>' +
        '<div class="detail-row"><strong>Email</strong><span>' + escapeHtml(student.email) + '</span></div>' +
        '<div class="detail-row"><strong>Course</strong><span>' + escapeHtml(student.course) + '</span></div>' +
        '<div class="detail-row"><strong>Year</strong><span>' + escapeHtml(student.year) + '</span></div>' +
        '<div class="form-actions">' +
        '<button class="primary-btn" data-view-action="edit" data-id="' + student.id + '">Edit</button>' +
        '<button class="secondary-btn" data-view-action="patch" data-id="' + student.id + '">Partial Update</button>' +
        '<button class="danger-btn" data-view-action="delete" data-id="' + student.id + '">Delete</button>' +
        '</div>' +
        '</div>';
  }

  function buildFormCard(title, buttonText, student, mode) {
    var nameValue = student && student.name ? student.name : '';
    var emailValue = student && student.email ? student.email : '';
    var courseValue = student && student.course ? student.course : '';
    var yearValue = student && student.year ? student.year : '';

    detailsEl.innerHTML =
        '<div class="form-card">' +
        '<h2>' + title + '</h2>' +
        '<form id="student-form" class="form-grid" data-mode="' + mode + '">' +
        '<div class="form-group">' +
        '<label for="name">Name</label>' +
        '<input id="name" name="name" type="text" value="' + escapeHtml(nameValue) + '" required>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="email">Email</label>' +
        '<input id="email" name="email" type="email" value="' + escapeHtml(emailValue) + '" required>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="course">Course</label>' +
        '<input id="course" name="course" type="text" value="' + escapeHtml(courseValue) + '" required>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="year">Year</label>' +
        '<input id="year" name="year" type="number" min="1" value="' + escapeHtml(yearValue) + '" required>' +
        '</div>' +
        '<div class="form-actions">' +
        '<button class="primary-btn" type="submit">' + buttonText + '</button>' +
        '<button class="secondary-btn" type="button" id="cancel-form-btn">Cancel</button>' +
        '</div>' +
        '</form>' +
        '</div>';

    document.getElementById('student-form').addEventListener('submit', function (event) {
      event.preventDefault();

      if (mode === 'create') {
        createStudent(this);
      } else if (mode === 'edit') {
        updateStudent(this, student.id);
      }
    });

    document.getElementById('cancel-form-btn').addEventListener('click', function () {
      if (student && student.id) {
        openStudent(student.id);
      } else {
        renderWelcome();
      }
    });
  }

  function buildPatchForm(student) {
    detailsEl.innerHTML =
        '<div class="form-card">' +
        '<h2>Partial Update Student</h2>' +
        '<form id="patch-form" class="form-grid">' +
        '<div class="form-group">' +
        '<label for="patch-name">Name</label>' +
        '<input id="patch-name" name="name" type="text" value="' + escapeHtml(student.name) + '">' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="patch-email">Email</label>' +
        '<input id="patch-email" name="email" type="email" value="' + escapeHtml(student.email) + '">' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="patch-course">Course</label>' +
        '<input id="patch-course" name="course" type="text" value="' + escapeHtml(student.course) + '">' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="patch-year">Year</label>' +
        '<input id="patch-year" name="year" type="number" min="1" value="' + escapeHtml(student.year) + '">' +
        '</div>' +
        '<div class="form-actions">' +
        '<button class="primary-btn" type="submit">Apply Patch</button>' +
        '<button class="secondary-btn" type="button" id="cancel-patch-btn">Cancel</button>' +
        '</div>' +
        '</form>' +
        '</div>';

    document.getElementById('patch-form').addEventListener('submit', function (event) {
      event.preventDefault();
      patchStudent(this, student);
    });

    document.getElementById('cancel-patch-btn').addEventListener('click', function () {
      openStudent(student.id);
    });
  }

  function getFormPayload(form) {
    return {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      course: form.course.value.trim(),
      year: Number(form.year.value)
    };
  }

  function createStudent(form) {
    api('/api/student', {
      method: 'POST',
      body: getFormPayload(form)
    }).then(function (response) {
      showMessage(response.message);
      return loadStudents();
    }).then(function () {
      openStudent(state.students[state.students.length - 1].id);
    }).catch(function (error) {
      showMessage(error.message, true);
    });
  }

  function updateStudent(form, studentId) {
    api('/api/student/' + studentId, {
      method: 'PUT',
      body: getFormPayload(form)
    }).then(function (response) {
      showMessage(response.message);
      return loadStudents().then(function () {
        openStudent(studentId);
      });
    }).catch(function (error) {
      showMessage(error.message, true);
    });
  }

  function patchStudent(form, originalStudent) {
    var payload = {};
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var course = form.course.value.trim();
    var year = form.year.value.trim();

    if (name !== originalStudent.name) payload.name = name;
    if (email !== originalStudent.email) payload.email = email;
    if (course !== originalStudent.course) payload.course = course;
    if (year !== String(originalStudent.year)) payload.year = Number(year);

    api('/api/student/' + originalStudent.id, {
      method: 'PATCH',
      body: payload
    }).then(function (response) {
      showMessage(response.message);
      return loadStudents().then(function () {
        openStudent(originalStudent.id);
      });
    }).catch(function (error) {
      showMessage(error.message, true);
    });
  }

  function deleteStudent(studentId) {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    api('/api/student/' + studentId, {
      method: 'DELETE'
    }).then(function (response) {
      showMessage(response.message);
      state.activeStudent = null;
      return loadStudents();
    }).then(function () {
      renderWelcome();
    }).catch(function (error) {
      showMessage(error.message, true);
    });
  }

  function openStudent(studentId) {
    api('/api/student/' + studentId)
        .then(function (response) {
          state.activeStudent = response.data;
          state.mode = 'view';
          renderStudentDetails(response.data);
        })
        .catch(function (error) {
          showMessage(error.message, true);
        });
  }

  function openCreateForm() {
    state.mode = 'create';
    buildFormCard('Add Student', 'Create Student', null, 'create');
  }

  function openEditForm(studentId) {
    api('/api/student/' + studentId)
        .then(function (response) {
          state.activeStudent = response.data;
          state.mode = 'edit';
          buildFormCard('Edit Student', 'Update Student', response.data, 'edit');
        })
        .catch(function (error) {
          showMessage(error.message, true);
        });
  }

  function openPatchForm(studentId) {
    api('/api/student/' + studentId)
        .then(function (response) {
          state.activeStudent = response.data;
          state.mode = 'patch';
          buildPatchForm(response.data);
        })
        .catch(function (error) {
          showMessage(error.message, true);
        });
  }

  listEl.addEventListener('click', function (event) {
    var button = event.target.closest('[data-action]');
    if (!button) return;

    var action = button.getAttribute('data-action');
    var studentId = button.getAttribute('data-id');

    if (action === 'view') {
      openStudent(studentId);
    } else if (action === 'edit') {
      openEditForm(studentId);
    } else if (action === 'patch') {
      openPatchForm(studentId);
    } else if (action === 'delete') {
      deleteStudent(studentId);
    }
  });

  detailsEl.addEventListener('click', function (event) {
    var button = event.target.closest('[data-view-action]');
    if (!button) return;

    var action = button.getAttribute('data-view-action');
    var studentId = button.getAttribute('data-id');

    if (action === 'edit') {
      openEditForm(studentId);
    } else if (action === 'patch') {
      openPatchForm(studentId);
    } else if (action === 'delete') {
      deleteStudent(studentId);
    }
  });

  addStudentBtn.addEventListener('click', function () {
    openCreateForm();
  });

  fetchClientConfig()
      .then(loadStudents)
      .then(renderWelcome)
      .catch(function (error) {
        showMessage(error.message, true);
        listEl.innerHTML =
            '<div class="empty-card">' +
            '<h2>Unable to Load</h2>' +
            '<p class="empty-state">' + escapeHtml(error.message) + '</p>' +
            '</div>';
        renderWelcome();
      });
})();