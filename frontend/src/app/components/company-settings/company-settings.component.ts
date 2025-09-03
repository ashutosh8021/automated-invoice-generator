import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css']
})
export class CompanySettingsComponent implements OnInit {
  companyForm: FormGroup;
  isLoading = false;
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.companyForm = this.fb.group({
      companyName: [environment.companyName || '', Validators.required],
      companyAddress: [environment.companyAddress || ''],
      companyPhone: [environment.companyPhone || ''],
      companyEmail: [environment.companyEmail || '', [Validators.email]],
      companyWebsite: [environment.companyWebsite || '']
    });
  }

  ngOnInit(): void {
    this.loadCompanySettings();
  }

  loadCompanySettings(): void {
    // Load from localStorage if available
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.companyForm.patchValue(settings);
    }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.isLoading = true;
      const formValue = this.companyForm.value;
      
      // Save to localStorage
      localStorage.setItem('companySettings', JSON.stringify(formValue));
      
      // Update environment (for current session)
      Object.assign(environment, formValue);
      
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Company settings saved successfully! Refresh the page to see changes in the navbar.';
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }

  resetToDefaults(): void {
    this.companyForm.patchValue({
      companyName: 'Your Company Name',
      companyAddress: 'Your Company Address',
      companyPhone: 'Your Phone Number',
      companyEmail: 'your-email@company.com',
      companyWebsite: 'www.yourcompany.com'
    });
  }
}
