import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NbMenuItem, NbToastrService, NbMenuService, NbDialogService, NbComponentStatus } from '@nebular/theme';
import { DatabaseService } from '../core/services/database/database.service';
import { TranslateService } from '@ngx-translate/core';
import { Experiment, Test, Group, Subject } from '../core/models/entities';
import { AddExperimentComponent } from '../shared/components/dialogs/add-experiment/add-experiment.component';
import { AddTestComponent } from '../shared/components/dialogs/add-test/add-test.component';
import { AddGroupComponent } from '../shared/components/dialogs/add-group/add-group.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit {

  current: Experiment;
  name: string;
  description: string;

  tests: NbMenuItem[] = [];

  subjects: NbMenuItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private toastrService: NbToastrService,
    private translate: TranslateService,
    private menuService: NbMenuService,
    private dialogService: NbDialogService
  ) {
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'subjects'),
      )
      .subscribe((event) => {
        console.log(event.item.data.id)
      });

  }

  idExperiment: number;

  ngOnInit(): void {
    this.idExperiment = this.route.snapshot.params['id'];
    this.getExperiment();
  }

  getExperiment() {
    this.databaseService.getExperimentData(this.idExperiment)
      .then(experiment => {
        this.current = experiment
        this.name = this.current.name;
        this.description = this.current.description

        this.tests = experiment.tests.map((element) => {
          return {
            title: element.name,
            icon: 'flask'
          }
        });
        this.menuService.addItems(this.tests, 'tests');

        this.subjects = experiment.groups.map((element) => {
          return {
            title: element.name,
            icon: 'users',

            children: element.subjects.map((subject) => {
              return {
                title: subject.name,
                icon: 'user-circle',
                data: {
                  id: subject.idSubject
                }
              }
            })
          }
        });
        this.menuService.addItems(this.subjects, 'subjects');
      })
      .catch((error) => {
        let title: string = this.translate.instant('ERROR')
        let message: string = this.translate.instant('DATABASE-ERROR')

        this.showToast(
          'danger',
          title,
          message
        )
      });
  }

  showToast(status: NbComponentStatus, title, content) {
    this.toastrService.show(content, title, { status });
  }

  editExperiment() {
    this.dialogService.open(AddExperimentComponent,
      {
        context: {
          name: this.current.name,
          description: this.current.description,
          editMode: true
        }
      })
      .onClose.subscribe(newExperiment => newExperiment &&
        this.databaseService
          .connection
          .then(() =>
            this.current.name = newExperiment.name,
            this.current.description = newExperiment.description
          )
          .then(() =>
            this.current.save())
          .then(() => {
            let title: string = this.translate.instant('SUCCESS')
            let message: string = this.translate.instant('EXPERIMENT-SAVED')

            this.showToast(
              'success',
              title,
              message
            )
          }).then(() => {
            this.getExperiment()
          })
      );
  }

  newTest() {
    this.dialogService.open(AddTestComponent, { context: { editMode: false } })
      .onClose.subscribe(newTest => newTest &&
        this.saveTest(newTest.name, newTest.description, newTest.duration));
  }

  saveTest(name, description, duration) {
    const test = new Test();

    test.idExperiment = this.idExperiment;
    test.name = name;
    test.description = description;
    test.duration = duration;

    this.databaseService
      .connection
      .then(() => test.save())
      .then(() => {
        this.getExperiment();
      })
      .then(() => {
        let title: string = this.translate.instant('SUCCESS')
        let message: string = this.translate.instant('EXPERIMENT-SAVED')

        this.showToast(
          'success',
          title,
          message
        )
      })
  }

  addGroup() {
    this.dialogService.open(AddGroupComponent, { context: { editMode: false } })
      .onClose.subscribe(newGroup => newGroup &&
        this.saveGroup(newGroup.name, newGroup.description));
  }

  addSubject() {
    this.dialogService.open(AddGroupComponent, { context: { editMode: false } })
      .onClose.subscribe(newGroup => newGroup &&
        this.saveGroup(newGroup.name, newGroup.description));
  }

  saveGroup(name, description) {
    const group = new Group();

    group.idExperiment = this.idExperiment;
    group.name = name;
    group.description = description;

    this.databaseService
      .connection
      .then(() => group.save())
      .then(() => {
        this.getExperiment();
      })
      .then(() => {
        let title: string = this.translate.instant('SUCCESS')
        let message: string = this.translate.instant('EXPERIMENT-SAVED')

        this.showToast(
          'success',
          title,
          message
        )
      })
  }
}
