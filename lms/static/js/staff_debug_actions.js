// Build StaffDebug object
var StaffDebug = (function(){

  get_current_url = function() {
    return window.location.pathname;
  }

  get_url = function(action){
    var pathname = this.get_current_url();
    var url = pathname.substr(0,pathname.indexOf('/courseware')) + '/instructor_dashboard/api/' + action;
    return url;
  }

  get_user = function(locname){
    var uname = $('#sd_fu_' + locname).val();
    if (uname==""){
        uname =  $('#sd_fu_' + locname).attr('placeholder');
    }
    return uname;
  }

  do_idash_action = function(action){
    var pdata = {
        'problem_to_reset': action.location,
        'unique_student_identifier': get_user(action.location),
        'delete_module': action.delete_module
    }
    $.ajax({
        type: "GET",
        url: get_url(action.method),
        data: pdata,
        success: function(data){
            var text = _.template(
                action.success_msg,
                {user: data.student},
                {interpolate: /\{(.+?)\}/g}
            )
            var html = _.template(
                '<p id="idash_msg" class="success">{text}</p>',
                {text: text},
                {interpolate: /\{(.+?)\}/g}
            )
            $("#result_"+action.location).html(html);
        },
        error: function(request, status, error) {
            var response_json;
            try {
                response_json = $.parseJSON(request.responseText);
            } catch(e) {
                response_json = { error: gettext('Unknown Error Occurred.') };
            }
            var text = _.template(
                '{error_msg} {error}',
                {
                    error_msg: action.error_msg,
                    error: response_json.error
                },
                {interpolate: /\{(.+?)\}/g}
            )
            var html = _.template(
                '<p id="idash_msg" class="error">{text}</p>',
                {text: text},
                {interpolate: /\{(.+?)\}/g}
            )
            $("#result_"+action.location).html(html);
        },
        dataType: 'json'
    });
  }

  reset = function(locname){
    this.do_idash_action({
        location: locname,
        method: 'reset_student_attempts',
        success_msg: gettext('Successfully reset the attempts for user {user}'),
        error_msg: gettext('Failed to reset attempts.'),
        delete_module: false
    });
  }

  sdelete = function(locname){
    this.do_idash_action({
        location: locname,
        method: 'reset_student_attempts',
        success_msg: gettext('Successfully deleted student state for user {user}'),
        error_msg: gettext('Failed to delete student state.'),
        delete_module: true
    });
  }

  rescore = function(locname){
    this.do_idash_action({
        location: locname,
        method: 'rescore_problem',
        success_msg: gettext('Successfully rescored problem for user {user}'),
        error_msg: gettext('Failed to rescore problem.'),
        delete_module: false
    });
  }

  return {
      reset: reset,
      sdelete: sdelete,
      rescore: rescore,
      do_idash_action: do_idash_action,
      get_current_url: get_current_url,
      get_url: get_url,
      get_user: get_user
  }
})();

// Register click handlers
$(document).ready(function() {
    $('#staff-debug-reset').click(function() {
        StaffDebug.reset($(this).data('location'));
        return false;
    });
    $('#staff-debug-sdelete').click(function() {
        StaffDebug.sdelete($(this).data('location'));
        return false;
    });
    $('#staff-debug-rescore').click(function() {
        StaffDebug.rescore($(this).data('location'));
        return false;
    });
});
