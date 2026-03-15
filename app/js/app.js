/**
 * HireOrGetHired — Demo app helpers.
 * Dummy auth: role is implied by which dashboard you're on.
 */
(function() {
  window.HOGH = {
    isRecruiter: function() {
      return /recruiter\.html/.test(window.location.pathname) || window.sessionStorage.getItem('hogh_role') === 'recruiter';
    },
    isJobSeeker: function() {
      return /jobseeker\.html/.test(window.location.pathname) || window.sessionStorage.getItem('hogh_role') === 'jobseeker';
    },
    setRole: function(role) {
      try { window.sessionStorage.setItem('hogh_role', role); } catch (e) {}
    }
  };
})();
