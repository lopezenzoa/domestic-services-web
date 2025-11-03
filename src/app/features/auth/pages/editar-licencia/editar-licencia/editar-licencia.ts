import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProvidersService } from '../../../services/providers.service';

@Component({
  selector: 'app-editar-licencia',
  standalone:true,
  imports: [CommonModule,FormsModule,MatSnackBarModule],
  templateUrl: './editar-licencia.html',
  styleUrl: './editar-licencia.css'
})
export class EditarLicencia {
  private providerService = inject(ProvidersService)
  private snackBar = inject(MatSnackBar)

  providerId = 1 //reemplaza despues con id real del prestador logueado
  licenseNumber=''

  onSubmit(){
    if(!this.licenseNumber.trim()){
      this.snackBar.open('Por favor ingresa tu numero de licencia.', 'Cerrar',{
        duration:3000,
        panelClass:['error-snackbar']
      });
      return;
    }
    this.providerService.updateLicense(this.providerId,this.licenseNumber).subscribe({
      next:() =>{
        this.snackBar.open('Numero de licensia actualizada con exito','Cerrar',{
          duration:3000,
          panelClass:['success-snackbar']
        })
        this.licenseNumber = ''
      },
      error:(err) =>{
                console.error('Error:', err);
        this.snackBar.open('Hubo un error al actualizar la licencia.', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        })
      }
    })
  }
}
