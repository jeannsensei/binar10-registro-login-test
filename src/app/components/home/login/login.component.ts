import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { routerNgProbeToken } from '@angular/router/src/router_module';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordForm: FormGroup;
  submitted = false;
  respuesta: any;
  public respuesta_servidor: boolean;
  disabled: boolean;
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    public http: HttpClient,
    public location: Location,
    public router: Router,
    route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['', [Validators.minLength(6), Validators.maxLength(50)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.http
      .post(
        'http://192.168.1.62/supervisores_api/public/api/login',
        // 'https://jsonplaceholder.typicode.com/posts',
        // 'http://192.168.1.4/supervisores_api/public/api/register',
        // 'https://panes-uber.000webhostapp.com/clientes/insertar_cliente.php',
        // this.registrationForm.value
        JSON.stringify(this.loginForm.value),
        {
          headers: new HttpHeaders({
            Authorization: 'Access',
            'Content-Type': 'application/json'
          })
        }
      )
      .subscribe(
        data => {
          // console.log(data['status']);
          // console.log('POST Request is successful ', data);
          const token = data['access_token'];
          localStorage.setItem('token', token);
          this.router.navigate(['/contacto']);
          this.http
            .get('http://192.168.1.62/supervisores_api/public/api/posts', {
              headers: new HttpHeaders({
                Accept: 'application/json',
                Authorization: 'Bearer' + ' ' + localStorage.getItem('token')
              })
            })
            .subscribe(textos => console.log(textos));
        },
        error => {
          console.log('Error', error);
          // if ((error['status'] = 401)) {
          //   console.log('error 401 lol');
          // } else {
          //   console.log('pasó esa damon');
          // }
        }
      );
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
  }
}
