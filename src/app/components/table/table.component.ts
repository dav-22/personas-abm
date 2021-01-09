import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PersonaService } from 'src/app/services/persona.service';
import { Persona } from '../../models/persona.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form.dialog.component';
import { Subject } from 'rxjs/internal/Subject';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'my-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  TAG: string = 'TableComponent';
  personas: Persona[];
  row: string;
  unsubscribeAll: Subject<any>;

  constructor(
    private personaService: PersonaService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.row = '';
    this.personas = [];
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  ngOnChanges(): void {}

  ngOnInit(): void {
    this.spinner.show();
    this.personaService.getAll().subscribe(
      (res) => {
        this.personas = [];
        res.map((e: any, i: number) => {
          this.personas.push(e.payload.doc.data());
          this.personas[i].id = e.payload.doc.id;
          this.personas = [...this.personas];
          this.spinner.hide();
          console.log(`${this.TAG} > Personas > `, i);
        });
      },
      (err) => {
        console.log(`${this.TAG} > personas > error > `, err);
        this.spinner.hide();
      }
    );
  }

  deletePersona(id: string) {
    this.personaService
      .delete(id)
      .then((res) => {
        console.log(`${this.TAG} > eliminado > res > `, res);
        this.openSnackBar('Registro eliminado!', 'Cerrar');
      })
      .catch((err) => {
        console.log(`${this.TAG} > no eliminado > err > `, err);
      });
  }

  openDialog(rowId: string) {
    this.row = rowId;
    this.dialog.open(FormDialogComponent, {
      height: '500px',
      width: '550px',
      data: {
        rowId: this.row,
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
