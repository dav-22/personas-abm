import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pais } from 'src/app/models/pais.model';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { PaisService } from '../../services/pais.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

class DialogData {
  rowId: string;
}

@Component({
  selector: 'app-form-dialog',
  templateUrl: 'form.dialog.component.html',
  styleUrls: ['form.dialog.component.scss'],
})
export class FormDialogComponent implements OnInit {
  TAG: string = 'FormDialogComponent';
  formGroup: FormGroup;
  paises: Pais[];
  persona: Persona;
  personaToEdit: any;

  constructor(
    private formBuilder: FormBuilder,
    private paisService: PaisService,
    private personaService: PersonaService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<any>,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.formGroup = this.createFormGroup();
    this.paises = [];
  }

  ngOnInit(): void {
    this.paisService.getAll().subscribe((res) => {
      res.map((e: any, i: number) => {
        this.paises.push(e.payload.doc.data());
        this.paises = [...this.paises];
      });
      console.log(`${this.TAG} > FormDialogComponent  > `, this.paises);
    });
    console.log(this.formGroup.getRawValue());

    if (this.data.rowId != '0') {
      this.spinner.show();
      this.personaService
        .getById(this.data.rowId)
        .then((res) => {
          this.personaToEdit = res.data();
          this.formGroup.setValue({
            nombre: this.personaToEdit.nombre,
            apellido: this.personaToEdit.apellido,
            direccion: this.personaToEdit.direccion,
            pais: this.personaToEdit.pais,
            fnac: this.personaToEdit.fnac.toDate(),
            telefono: this.personaToEdit.telefono,
          });
          this.spinner.hide();
        })
        .catch((err) => {
          console.log(`${this.TAG} > getById > error > `, err);
          this.spinner.hide();
        });
    }
  }

  addOrEditPersona() {
    this.getValues();
    if (this.data.rowId == '0') {
      console.log(`${this.TAG} > getRawvalues > `, this.persona);
      this.personaService
        .add(this.persona)
        .then((res) => {
          console.log(`${this.TAG} > add > res > `, res);

          this.openSnackBar('Registro agregado!', 'Cerrar');
        })
        .catch((err) => {
          console.log(`${this.TAG} > add > err > `, err);
        });
    } else {
      this.personaService
        .update(this.data.rowId, this.persona)
        .then((res) => {
          console.log(`${this.TAG} > personaEdit  > res `, res);
          console.log(`${this.TAG} > getRawvalues > `, this.persona);
          this.openSnackBar('Registro editado!', 'Cerrar');
        })
        .catch((err) => {
          console.log(`${this.TAG} > personaEdit  > err `, err);
        });
    }
    this.dialogRef.close();
  }

  getValues() {
    this.persona = this.formGroup.getRawValue();
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fnac: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      pais: ['', [Validators.required]],
    });

    return formGroup;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
