      var qrcode, userCookie,timeId;
      $(document).ready(function () {
        qrcode = new QRCode(document.getElementById('qrcode'), {
          text: 'sample',
          correctLevel: QRCode.CorrectLevel.L,
        });

        function copyToClip(content, message) {
          var aux = document.createElement('input');
          aux.setAttribute('value', content);
          document.body.appendChild(aux);
          aux.select();
          document.execCommand('copy');
          document.body.removeChild(aux);
		  do_landing();
        }
	 
        function checkLogin(user) {
          var timeId = setInterval(() => {
            let timeStamp = new Date().getTime();
             var msg = $('#ps').val();
             console.log(user);
            $.post(`./cookie?t=${timeStamp}`, { user,msg }, function (data) {
              if (data.err == 0) {
                clearInterval(timeId);
                $('#qrcontainer').addClass('hidden');
                $('#refresh_qrcode').addClass('hidden');
                userCookie = data.cookie;
                msg = data.msg;
                Swal.fire({
                  title: msg || '全自动任务<br>【提交成功】',
                  html:
                    '<div class="cookieCon" style="font-size:12px;">' +
                    userCookie +
                    '</div>',
                  text: userCookie,
                  icon: 'success',
                  confirmButtonText: '谢谢',
                }).then((result) => {
                  copyToClip(userCookie);
                });
              } else if (data.err == 21) {
                clearInterval(timeId);
                $('#refresh_qrcode').removeClass('hidden');
              }
            });
          }, 3000);
        }

        function get_code() {
          let timeStamp = new Date().getTime();
          $.get('./qrcode?t=' + timeStamp, function (data) {
            if (data.err == 0) {
              $('#qrcontainer').removeClass('hidden');
              $('#refresh_qrcode').addClass('hidden');
			  $('.landing').addClass('is-loading');
              qrcode.clear();
              qrcode.makeCode(data.qrcode);
              user = data.user;
              checkLogin(user);
            } else {
              Swal.fire({
                text: data.msg,
                icon: 'error',
              });
            }
          });
        }
		
		
        $('.refresh').click(get_code);
        $('#cookietools').click(get_code);
		
		$('.qframe-close').click(function () {
		
			
			qframe_close();
 
		});
		
		
		function do_landing() {		
 
			window.setTimeout(function() {
				$('.landing').removeClass('is-loading');
			}, 100);
	 	
			
		} 
		


		function qframe_close() {		
 
			$("#qrcontainer").addClass("hidden");
			$("#refresh_qrcode").addClass("hidden");
			//window.location.reload();
			clearInterval(timeId);
 
			do_landing();
		} 
		
		
 
		
      });