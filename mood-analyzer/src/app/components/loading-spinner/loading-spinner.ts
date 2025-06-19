import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,  template: `
    <div class="spinner-container" data-cy="loading-spinner">
      <div class="spinner"></div>
    </div>
    <style>
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 1000;
      }
      
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(63, 81, 181, 0.2);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    </style>
  `
})
export class LoadingSpinnerComponent {}
